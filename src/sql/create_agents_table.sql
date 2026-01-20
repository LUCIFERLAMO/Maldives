-- Create 'agents' table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    work_email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    experience_region TEXT,
    documents JSONB DEFAULT '{}'::jsonb,
    agreed_to_terms BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow agents to view their own profile
CREATE POLICY "Agents can view own profile" 
ON public.agents 
FOR SELECT 
USING (auth.uid() = auth_id);

-- Policy: Allow agents to update their own profile
CREATE POLICY "Agents can update own profile" 
ON public.agents 
FOR UPDATE 
USING (auth.uid() = auth_id);

-- Policy: Allow insertion during registration (authenticated or anon depending on flow, usually authenticated if linked to auth.users)
-- Assuming the user is signed up via Auth first.
CREATE POLICY "Users can insert their own agent profile" 
ON public.agents 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Create a unique constraint on work_email or auth_id to prevent duplicates
ALTER TABLE public.agents ADD CONSTRAINT agents_auth_id_key UNIQUE (auth_id);
