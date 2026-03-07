const fs = require('fs');

let frontend = fs.readFileSync('frontend/src/pages/RecruiterDashboard.jsx', 'utf8');

frontend = frontend.replace(
    /useEffect\(\(\) => \{\s+const fetchJobs = async \(\) => \{([\s\S]+?)fetchJobs\(\);\s+\}, \[\]\);/,
    "const fetchJobs = async () => {\};\n\n    useEffect(() => {\n        fetchJobs();\n    }, []);"
);

fs.writeFileSync('frontend/src/pages/RecruiterDashboard.jsx', frontend, 'utf8');
console.log("Fixed fetchJobs scope!");
