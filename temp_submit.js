    };

    const handleConfirmSubmission = async () => {
        if (!selectedJobForSubmission) {
            popup.warning("No job selected for submission.");
            return;
        }

        if (!submissionFiles.resume || !submissionFiles.identity || !submissionFiles.certs) {
            popup.warning("Please upload all mandatory documents (Resume, ID/Passport, Certificates).");
            return;
        }

        if (!submissionData.name || !submissionData.email || !submissionData.whatsapp || !submissionData.nationality) {
            popup.warning("Please fill in all identity details (Name, Email, Phone, Nationality).");
            return;
        }

        if (!user?.id) {
            popup.error("User not authenticated. Please log in again.");
            return;
        }

        try {
            // Create FormData for file upload
            const formDataPayload = new FormData();
            formDataPayload.append('agent_id', user.id);
            formDataPayload.append('job_id', selectedJobForSubmission.id || selectedJobForSubmission._id || '');
            formDataPayload.append('name', submissionData.name);
            formDataPayload.append('email', submissionData.email);
            formDataPayload.append('contact', submissionData.whatsapp);
            formDataPayload.append('nationality', submissionData.nationality);
            formDataPayload.append('resume', submissionFiles.resume);

            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: 'POST',
                body: formDataPayload,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Submission failed');
            }

            popup.success("Success! Candidate Submitted to Database.");
            setSelectedJobForSubmission(null);

            // Refresh Pipeline
            const pipelineResponse = await fetch(`${API_BASE_URL}/api/applications?agent_id=${user.id}`);
            const pipelineData = await pipelineResponse.json();
            if (pipelineData) setPipelineData(Array.isArray(pipelineData) ? pipelineData : []);

        } catch (err) {
            console.error("Submission Error:", err);
            popup.error("Error: " + (err.message || 'An error occurred during submission'));
        }
    };

    // --- AGENT PROFILE FETCHER ---
    const [agentProfile, setAgentProfile] = useState(null);
    useEffect(() => {
        if (!user?.id) return;

        const fetchAgentProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/agents/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAgentProfile(data);
                }
            } catch (error) {
                console.error("Error fetching agent profile:", error);
            }
        };
        fetchAgentProfile();
    }, [user?.id]);

    // FIXED: Added null checks for user object
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg text-center">