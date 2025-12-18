'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface Comment {
    id: string;
    text: string;
    userName: string;
    createdAt: string;
}

interface CatCommentsProps {
    catId: string;
}

export function CatComments({ catId }: CatCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Real-time listener untuk comments
    useEffect(() => {
        const commentsRef = collection(db, 'cats', catId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const commentsData = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text,
                        userName: data.userName || 'Anonymous',
                        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
                    };
                });
                setComments(commentsData);
                setIsLoading(false);
            },
            (error) => {
                console.error('Error fetching comments:', error);
                setIsLoading(false);
                toast({
                    title: 'Error',
                    description: 'Gagal memuat komentar',
                    variant: 'destructive',
                });
            }
        );

        return () => unsubscribe();
    }, [catId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const commentsRef = collection(db, 'cats', catId, 'comments');
            await addDoc(commentsRef, {
                text: newComment.trim(),
                userName: 'Anonymous', // TODO: Integrate with auth
                createdAt: serverTimestamp(),
            });

            setNewComment('');
            toast({
                title: 'Berhasil',
                description: 'Komentar berhasil ditambahkan',
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan komentar',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Komentar</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                    placeholder="Tulis komentar..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Kirim Komentar
                        </>
                    )}
                </Button>
            </form>

            {/* Comments List */}
            <ScrollArea className="h-[300px] rounded-md border p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        Belum ada komentar. Jadilah yang pertama!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{comment.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt), {
                                                addSuffix: true,
                                                locale: idLocale,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
