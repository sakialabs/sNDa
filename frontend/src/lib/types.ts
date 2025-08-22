export interface User {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface Person {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    gender?: string;
    location_details?: string;
}

export interface Case {
    id: string;
    title: string;
    description: string;
    status: string;
    urgency_score?: number;
    created_at: string;
    primary_subject: Person;
    assigned_volunteer?: User | null;
    thumbnail_url?: string | null;
}

export interface VolunteerProfile {
    user: User;
    phone_number?: string;
    skills?: string;
    availability?: string;
    is_onboarded: boolean;
}

export interface ReferralMediaItem {
    id: string;
    case: string;
    file: string;
    description?: string;
    consent_given: boolean;
    uploaded_at: string;
    uploaded_by?: User;
}