const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, 'users.json');

// Ensure users.json exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf8');
}

const readUsers = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
};

module.exports = {
  readUsers,
  writeUsers
};
