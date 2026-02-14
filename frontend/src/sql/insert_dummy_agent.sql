-- Insert Dummy Agent for Testing
INSERT INTO public.agents (
    auth_id,
    full_name,
    work_email,
    phone,
    company_name,
    experience_region,
    documents,
    agreed_to_terms,
    status
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Matches AgentLoginPage.jsx mock ID
    'Developer Agent',
    'dev@agent.com',
    '+1 555 0101',
    'Maldives Elite Staffing',
    'North America',
    '{"business_license": "license.pdf", "tax_cert": "tax.pdf"}'::jsonb,
    TRUE,
    'approved'
) ON CONFLICT (auth_id) DO UPDATE 
SET 
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name;
