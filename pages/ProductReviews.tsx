import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Product, Review } from "../types";
import { CommentReply } from "../components/ui/comment-reply";
import { ChevronLeft } from "lucide-react";
import { Tr } from "../components/Tr";

const ProductReviews: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "products", id)).then(snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
    });

    const q = query(collection(db, "reviews"), where("productId", "==", id));
    const unsub = onSnapshot(q, (snapshot) => {
      const reviewList = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Review,
      );
      reviewList.sort((a, b) => b.createdAt - a.createdAt);
      setReviews(reviewList);
    });

    return () => unsub();
  }, [id]);

  if (!product) return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900" />;

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-12">
      <div className="sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition mr-4">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight"><Tr>All Reviews</Tr></h1>
      </div>

      <div className="p-4 md:p-8 flex flex-col gap-4">
         {reviews.map((review) => (
           <div key={review.id} className="bg-white dark:bg-zinc-900/50 rounded-[28px] border border-zinc-200 shadow-sm dark:border-zinc-800 overflow-hidden">
             <CommentReply review={review as any} onReply={async (text, image) => {
                 const { auth } = await import("../firebase");
                 if (!auth.currentUser) return alert("Please login to reply");
                 try {
                    const newReply = { userId: auth.currentUser.uid, userName: auth.currentUser.displayName || 'User', userPhoto: auth.currentUser.photoURL || '', text, image, createdAt: Date.now() };
                    const { updateDoc, arrayUnion } = await import("firebase/firestore");
                    await updateDoc(doc(db, "reviews", review.id), {
                       replies: arrayUnion(newReply)
                    });
                 } catch(e) {
                    alert("Failed to add reply");
                 }
              }} />
           </div>
         ))}
      </div>
    </div>
  );
};

export default ProductReviews;
