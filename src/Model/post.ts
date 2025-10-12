export interface Comment {
    user: string;          // Nom complet de la personne qui commente
    text: string;          // Contenu du commentaire
    time: string;          // Date/heure du commentaire
    initiale: string;      // Initiales de la personne qui commente
  }
  
  export interface Post {
    _id?: string;
    content: string;       // Contenu du post
    user: string;          // Nom complet du créateur du post
    initials: string;      // ✅ Initiales fixes du créateur
    mediaUrl?: string;     // URL de l'image/vidéo
    mediaType?: 'image' | 'video' | null;
    isLiked: boolean;
    likes: number;
    isBookmarked: boolean;
    comments: Comment[];   // Liste des commentaires
    shares?: number;
    createdAt?: Date;
  }
  