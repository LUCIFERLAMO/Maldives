const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all jobs
 */
export const fetchJobs = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

/**
 * Fetch a single job by ID
 */
export const fetchJobById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch job');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching job ${id}:`, error);
        throw error;
    }
};

/**
 * Fetch all applications
 */
export const fetchApplications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

/**
 * Submit a new application
 * @param {FormData} formData 
 */
export const submitApplication = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            body: formData, // FormData handles headers automatically (multipart/form-data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit application');
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};
