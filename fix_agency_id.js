const fs = require('fs');
let backend = fs.readFileSync('backend/server.js', 'utf8');

backend = backend.replace(
    /agency_id:\s*req\.body\.agent_id,/g,
    "agent_id: req.body.agent_id,"
);

fs.writeFileSync('backend/server.js', backend, 'utf8');
console.log("Fixed agency_id to agent_id in backend!");
