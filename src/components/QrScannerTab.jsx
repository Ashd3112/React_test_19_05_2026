import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { Camera, Upload, QrCode, ArrowLeftRight, Check, X, ShieldAlert, Sparkles, Download, Volume2, VolumeX } from 'lucide-react';

const QrScannerTab = ({ userSession, cards, onAddTransaction, onUpdateCardBalance, onAddNotification }) => {
  const [activeSubTab, setActiveSubTab] = useState('scan'); // 'scan' | 'my-qr'
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' | 'upload'
  
  // Camera scanning states
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanMessage, setScanMessage] = useState('Ready to scan. Align the QR code in the frame.');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Video and Canvas refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Scan Result & Pay Drawer
  const [paymentData, setPaymentData] = useState(null); // { recipient, amount, email, category }
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [customAmount, setCustomAmount] = useState('');
  const [transferInProgress, setTransferInProgress] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // My QR settings
  const [qrAmount, setQrAmount] = useState('');
  const [qrPurpose, setQrPurpose] = useState('Personal Transfer');

  // Request cameras list
  useEffect(() => {
    if (activeSubTab === 'scan' && scanMethod === 'camera') {
      navigator.mediaDevices.enumerateDevices()
        .then(deviceList => {
          const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
          setDevices(videoDevices);
          if (videoDevices.length > 0) {
            setSelectedDevice(videoDevices[0].deviceId);
            setHasCamera(true);
          } else {
            setHasCamera(false);
            setScanMethod('upload');
          }
        })
        .catch(err => {
          console.error("Error enumerating devices:", err);
          setHasCamera(false);
          setScanMethod('upload');
        });
    }
  }, [activeSubTab, scanMethod]);

  // Start/stop camera based on state
  useEffect(() => {
    if (activeSubTab === 'scan' && scanMethod === 'camera' && selectedDevice) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeSubTab, scanMethod, selectedDevice]);

  const startCamera = async () => {
    setScanError('');
    setCameraActive(false);
    stopCamera();

    try {
      const constraints = {
        video: { deviceId: selectedDevice ? { exact: selectedDevice } : undefined }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        videoRef.current.play();
        setCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error("Webcam access failed:", err);
      setScanError("Unable to access camera. Please check permissions or try file upload.");
      setScanMethod('upload');
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Scan frame by painting it onto virtual canvas and decoding
  const scanFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          handleDecodedData(code.data);
          return; // stop loop
        }
      }
    }
    if (activeSubTab === 'scan' && scanMethod === 'camera') {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
  };

  // Beep Sound for scan success
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context beep failed:", e);
    }
  };

  // Decode logic for QR codes
  const handleDecodedData = (dataStr) => {
    playBeep();
    stopCamera();
    
    try {
      // Try to parse JSON format (e.g. {"recipient": "Randy Press", "amount": 250, "email": "randy.press@gmail.com"})
      const parsed = JSON.parse(dataStr);
      if (parsed.recipient || parsed.name || parsed.email) {
        setPaymentData({
          recipient: parsed.recipient || parsed.name || parsed.email,
          amount: parseFloat(parsed.amount) || null,
          email: parsed.email || 'scanned.recipient@bankdash.com',
          purpose: parsed.purpose || 'QR Scan Payment'
        });
        if (parsed.amount) {
          setCustomAmount(parsed.amount.toString());
        } else {
          setCustomAmount('');
        }
      } else {
        // Fallback if JSON but no target fields
        setPaymentData({
          recipient: dataStr,
          amount: null,
          email: 'scanned.recipient@bankdash.com',
          purpose: 'QR Scan Payment'
        });
        setCustomAmount('');
      }
    } catch (e) {
      // Plain text fallback (could be a name, account ID, or email address)
      setPaymentData({
        recipient: dataStr,
        amount: null,
        email: dataStr.includes('@') ? dataStr : 'scanned.recipient@bankdash.com',
        purpose: 'QR Scan Payment'
      });
      setCustomAmount('');
    }
  };

  // Handle local file QR scan
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanError('');
    setScanMessage('Processing file...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          handleDecodedData(code.data);
        } else {
          setScanError("No QR Code found in this image. Try another picture.");
          setScanMessage("Scanning failed. Please make sure the QR is clear and well-lit.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Process the final transaction
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(customAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (!selectedCard) {
      alert("Please select a card to pay from.");
      return;
    }

    if (selectedCard.balance < amountVal) {
      alert("Insufficient funds in the selected card account!");
      return;
    }

    setTransferInProgress(true);

    // Simulate network delay for premium visual feel
    setTimeout(() => {
      onUpdateCardBalance(selectedCard.id, selectedCard.balance - amountVal);

      const txId = `TX${Math.floor(1000 + Math.random() * 9000)}`;
      onAddTransaction({
        id: txId,
        desc: `Scan Pay to ${paymentData.recipient}`,
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        method: 'QR Scan Code',
        category: 'Transfer',
        amount: amountVal,
        status: 'Success'
      });

      onAddNotification({
        id: Date.now(),
        text: `Scan & Pay: Sent $${amountVal.toLocaleString()} to ${paymentData.recipient} from card ending ${selectedCard.number.slice(-4)}.`,
        time: "Just now",
        type: "success",
        unread: true
      });

      setTransferInProgress(false);
      setTransferSuccess(true);
    }, 1500);
  };

  // Generate local QR Data URL
  const [myQrUrl, setMyQrUrl] = useState('');
  useEffect(() => {
    const myQrObject = {
      name: userSession.name,
      email: userSession.email,
      purpose: qrPurpose,
      amount: qrAmount ? parseFloat(qrAmount) : null
    };
    const myQrString = JSON.stringify(myQrObject);
    QRCode.toDataURL(myQrString, { margin: 1, width: 250 })
      .then(url => setMyQrUrl(url))
      .catch(err => console.error("Local QR generation failed:", err));
  }, [userSession.name, userSession.email, qrPurpose, qrAmount]);

  // Close payment drawer and reset camera
  const handleCloseDrawer = () => {
    setPaymentData(null);
    setTransferSuccess(false);
    setCustomAmount('');
    if (activeSubTab === 'scan' && scanMethod === 'camera') {
      startCamera();
    }
  };

  return (
    <div className="qr-scanner-tab">
      {/* Sub Tabs Navigation */}
      <div className="section-header" style={{ borderBottom: '1px solid var(--ld-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div className="filter-tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
          <div 
            className={`filter-tab ${activeSubTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('scan')}
          >
            <Camera size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            Scan QR Code
          </div>
          <div 
            className={`filter-tab ${activeSubTab === 'my-qr' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('my-qr')}
          >
            <QrCode size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            Receive Money (My QR)
          </div>
        </div>

        {activeSubTab === 'scan' && scanMethod === 'camera' && (
          <button 
            className="icon-btn" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute scan sound" : "Unmute scan sound"}
            style={{ margin: 0, padding: '0.5rem', background: 'var(--panel-bg)', borderRadius: '50%' }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}
      </div>

      {activeSubTab === 'scan' ? (
        <div className="scanner-container-row">
          {/* Main Scanning Frame Card */}
          <div className="col-7">
            <div className="panel" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              
              {/* Camera selection dropdown and toggles */}
              <div className="scanner-header-controls">
                <button 
                  className={`scanner-toggle-btn ${scanMethod === 'camera' ? 'active' : ''}`}
                  onClick={() => { setScanMethod('camera'); setScanError(''); }}
                >
                  Live Webcam
                </button>
                <button 
                  className={`scanner-toggle-btn ${scanMethod === 'upload' ? 'active' : ''}`}
                  onClick={() => { setScanMethod('upload'); stopCamera(); setScanError(''); }}
                >
                  Upload Image
                </button>

                {scanMethod === 'camera' && devices.length > 1 && (
                  <select 
                    className="camera-selector-select"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                  >
                    {devices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        Camera {idx + 1} ({device.label.slice(0, 15) || 'Device'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {scanMethod === 'camera' ? (
                <div className="webcam-viewport">
                  {/* Glowing Box / Guides */}
                  <div className="scanner-overlay-guide">
                    <div className="scanner-laser-line"></div>
                    <div className="corner-guide top-left"></div>
                    <div className="corner-guide top-right"></div>
                    <div className="corner-guide bottom-left"></div>
                    <div className="corner-guide bottom-right"></div>
                  </div>

                  <video ref={videoRef} className="webcam-video-feed" playsInline />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {!cameraActive && !scanError && (
                    <div className="scanner-loader-overlay">
                      <div className="premium-spinner"></div>
                      <span style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Starting camera feed...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Upload Drag Drop Zone */
                <div className="upload-dropzone-wrapper">
                  <label htmlFor="qr-file-upload" className="dropzone-label">
                    <div className="upload-icon-circle">
                      <Upload size={32} />
                    </div>
                    <h4>Upload payment QR code</h4>
                    <p>Drag and drop image file, or click to browse</p>
                    <span className="file-formats-label">Supports PNG, JPG, JPEG</span>
                    <input 
                      type="file" 
                      id="qr-file-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
              )}

              {/* Status footer bar */}
              <div className="scanner-status-footer" style={scanError ? { background: 'rgba(255, 75, 74, 0.1)', color: '#FF4B4A' } : {}}>
                {scanError ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={16} />
                    <span>{scanError}</span>
                  </div>
                ) : (
                  <span>{scanMessage}</span>
                )}
              </div>

            </div>
          </div>

          {/* Quick instructions / Info Sidebar */}
          <div className="col-5">
            <div className="panel" style={{ minHeight: '420px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Sparkles size={20} color="var(--accent-primary)" />
                <h3 className="section-title" style={{ margin: 0 }}>Scan to Pay</h3>
              </div>
              <p style={{ color: '#718EBF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Quickly transfer funds to any other BankDash member. You can scan their profile QR code either by opening your camera or uploading a picture of the QR code.
              </p>

              <div className="instruction-steps">
                <div className="step-item">
                  <div className="step-badge">1</div>
                  <div>
                    <h5>Select Scan Option</h5>
                    <p>Use your camera to scan a QR code in real-time or upload a screenshot/image of the QR.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-badge">2</div>
                  <div>
                    <h5>Review Details</h5>
                    <p>Verify the recipient's name, email, and input the amount you wish to transfer.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-badge">3</div>
                  <div>
                    <h5>Confirm Transaction</h5>
                    <p>Select your source payment card, slide/confirm, and your funds are transferred instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* My QR tab - generates dynamic personal QR code to receive money */
        <div className="scanner-container-row">
          <div className="col-7">
            <div className="panel" style={{ minHeight: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem' }}>
              
              {/* Premium Dynamic QR Frame */}
              <div className="premium-qr-envelope">
                <div className="qr-envelope-chip"></div>
                <div className="qr-envelope-logo-brand">
                  <div className="logo-icon" style={{ width: '18px', height: '18px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span>BankDash.</span>
                </div>

                <div className="qr-code-canvas-frame" style={{ minWidth: '180px', minHeight: '180px' }}>
                  {myQrUrl ? (
                    <img src={myQrUrl} alt="My QR Code" className="generated-qr-image" />
                  ) : (
                    <div className="premium-spinner" style={{ width: '32px', height: '32px' }}></div>
                  )}
                </div>

                <div className="qr-envelope-holder-row">
                  <div>
                    <div className="envelope-holder-lbl">Account Holder</div>
                    <div className="envelope-holder-val">{userSession.name}</div>
                  </div>
                  {qrAmount && (
                    <div style={{ textAlign: 'right' }}>
                      <div className="envelope-holder-lbl">Requested Amount</div>
                      <div className="envelope-holder-val" style={{ color: 'var(--success)' }}>${parseFloat(qrAmount).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <a href={myQrUrl} target="_blank" rel="noreferrer" download={`bankdash_qr_${userSession.name}.png`} className="settings-save-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', margin: 0 }}>
                  <Download size={16} />
                  Download QR Code
                </a>
              </div>

            </div>
          </div>

          <div className="col-5">
            <div className="panel" style={{ minHeight: '440px', padding: '2rem' }}>
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Customize QR Request</h3>
              <p style={{ color: '#718EBF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Set an optional amount or transfer description below to embed them directly into your personal QR code.
              </p>

              <form className="qr-customizer-form" onSubmit={(e) => e.preventDefault()}>
                <div className="settings-input-group">
                  <label>Request Specific Amount ($)</label>
                  <input 
                    type="number"
                    className="settings-form-input"
                    placeholder="e.g. 150.00 (Leave empty for any amount)"
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                  />
                </div>

                <div className="settings-input-group">
                  <label>Transfer Purpose / Note</label>
                  <input 
                    type="text"
                    className="settings-form-input"
                    placeholder="e.g. Split Dinner Bill"
                    value={qrPurpose}
                    onChange={(e) => setQrPurpose(e.target.value)}
                  />
                </div>
              </form>

              <div className="qr-info-pills" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(57, 106, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(57, 106, 255, 0.1)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <QrCode size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span style={{ fontSize: '0.8rem', color: '#343C6A', fontWeight: 500, lineHeight: '1.5' }}>
                    When another BankDash app scans this QR, it will pre-fill your name, email, and the requested details automatically!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION PAY SLIDEOUT DRAWER */}
      {paymentData && (
        <div className="payment-drawer-backdrop">
          <div className="payment-drawer-container">
            <div className="drawer-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="drawer-badge-circle">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#343C6A', fontSize: '1.2rem', fontWeight: 700 }}>Confirm QR Transfer</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#718EBF' }}>Verify transaction details before completing the payment</p>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={handleCloseDrawer}>
                <X size={20} />
              </button>
            </div>

            {transferSuccess ? (
              <div className="drawer-success-view">
                <div className="success-lottie-mock">
                  <Check size={36} color="white" strokeWidth={3} />
                </div>
                <h3>Transfer Successful!</h3>
                <p>Sent <b>${parseFloat(customAmount).toLocaleString()}</b> to <b>{paymentData.recipient}</b></p>
                <button className="settings-save-btn" style={{ margin: '1.5rem 0 0 0' }} onClick={handleCloseDrawer}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="drawer-form-content">
                
                {/* Transfer Breakdown Cards */}
                <div className="drawer-breakdown-box">
                  <div className="breakdown-item">
                    <span className="lbl">Recipient</span>
                    <span className="val" style={{ fontWeight: 700 }}>{paymentData.recipient}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="lbl">Recipient Email</span>
                    <span className="val" style={{ color: '#718EBF' }}>{paymentData.email}</span>
                  </div>
                  {paymentData.purpose && (
                    <div className="breakdown-item">
                      <span className="lbl">Purpose</span>
                      <span className="val" style={{ fontStyle: 'italic' }}>{paymentData.purpose}</span>
                    </div>
                  )}
                </div>

                {/* Card Selection */}
                <div className="settings-input-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Select Debit Card Account</label>
                  <select 
                    className="settings-form-input"
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    required
                  >
                    {cards.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.type.toUpperCase()} Card ending {card.number.slice(-4)} (Bal: ${card.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div className="settings-input-group">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Transfer Amount ($)</label>
                  <input 
                    type="number"
                    className="settings-form-input"
                    placeholder="Enter amount to pay"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={paymentData.amount !== null} // Lock if amount was baked into the QR Code
                    required
                    step="0.01"
                  />
                  {paymentData.amount !== null && (
                    <span className="input-helper-note">Amount locked by QR Code request.</span>
                  )}
                </div>

                {/* Confirm Slide / Slider Button */}
                <div style={{ marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    className="settings-save-btn" 
                    style={{ width: '100%', margin: 0, padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={transferInProgress}
                  >
                    {transferInProgress ? (
                      <>
                        <div className="premium-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: 'white' }}></div>
                        Processing Secure Transfer...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight size={18} />
                        Confirm & Send ${parseFloat(customAmount || 0).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default QrScannerTab;
