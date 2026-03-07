const fs = require('fs');

let backend = fs.readFileSync('backend/server.js', 'utf8');
backend = backend.replace(
    /app\.post\('\/api\/applications',\s*upload\.fields\(\[\s*\{\s*name:\s*'resume',\s*maxCount:\s*1\s*\},\s*\{\s*name:\s*'identity',\s*maxCount:\s*1\s*\},\s*\{\s*name:\s*'certs',\s*maxCount:\s*1\s*\}\s*\]\)/,
    "app.post('/api/applications', upload.fields([ { name: 'resume', maxCount: 1 }, { name: 'identity', maxCount: 1 }, { name: 'certs', maxCount: 1 }, { name: 'pcc', maxCount: 1 }, { name: 'goodStanding', maxCount: 1 } ])"
);

let frontend = fs.readFileSync('frontend/src/pages/RecruiterDashboard.jsx', 'utf8');
frontend = frontend.replace(
    /formDataPayload\.append\('resume', submissionFiles\.resume\);/,
    "formDataPayload.append('resume', submissionFiles.resume);\n            if (submissionFiles.identity) formDataPayload.append('identity', submissionFiles.identity);\n            if (submissionFiles.certs) formDataPayload.append('certs', submissionFiles.certs);\n            if (submissionFiles.pcc) formDataPayload.append('pcc', submissionFiles.pcc);\n            if (submissionFiles.goodStanding) formDataPayload.append('goodStanding', submissionFiles.goodStanding);"
);

fs.writeFileSync('backend/server.js', backend, 'utf8');
fs.writeFileSync('frontend/src/pages/RecruiterDashboard.jsx', frontend, 'utf8');
console.log("Fixed Multer and FormData payload!");
