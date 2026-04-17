export interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  totalVotes: number;
  verifiedVotes: number;
  approved: boolean;
}

export interface Vote {
  id: string;
  candidateId: string;
  voterName: string;
  voterLastName: string;
  voterCI: string;
  idPhotoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
}
