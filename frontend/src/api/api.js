import _API_BASE from './config.js';
const API_BASE_URL = `${_API_BASE}/api`;

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

/**
 * Fetch saved jobs for a candidate profile
 */
export const fetchSavedJobs = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}/saved-jobs`);
        if (!response.ok) throw new Error('Failed to fetch saved jobs');
        return await response.json();
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        throw error;
    }
};

/**
 * Toggle a saved job for a candidate profile
 */
export const toggleSavedJob = async (userId, jobId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}/save-job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jobId })
        });
        if (!response.ok) throw new Error('Failed to toggle saved job');
        return await response.json();
    } catch (error) {
        console.error('Error toggling saved job:', error);
        throw error;
    }
};
