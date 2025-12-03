import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ShoppingBag, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CreatePost from '../components/features/CreatePost';

const StyleWall = () => {
    const { user, showToast } = useApp();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!user) {
            showToast('Please login to like posts', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === postId ? updatedPost : p));
            }
        } catch (error) {
            showToast('Failed to like post', 'error');
        }
    };

    const handleComment = async (postId, text) => {
        if (!user) {
            showToast('Please login to comment', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('yuva-token');
            const res = await fetch(`/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map(p => p._id === postId ? updatedPost : p));
                setSelectedPost(null);
            }
        } catch (error) {
            showToast('Failed to add comment', 'error');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading style wall...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Style Wall</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Share your style, inspire others</p>
                    </div>
                    {user && (
                        <button
                            onClick={() => setShowCreatePost(true)}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={20} />
                            Create Post
                        </button>
                    )}
                </div>

                {/* Posts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {posts.map(post => (
                        <div
                            key={post._id}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {/* Post Image */}
                            <div style={{ position: 'relative', paddingTop: '100%', background: '#000' }}>
                                <img
                                    src={`http://localhost:5001${post.image}`}
                                    alt="Post"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Post Info */}
                            <div style={{ padding: '1.5rem' }}>
                                {/* User Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-purple)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold' }}>{post.user?.name || 'Anonymous'}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Caption */}
                                {post.caption && (
                                    <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>{post.caption}</p>
                                )}

                                {/* Tagged Products */}
                                {post.taggedProducts && post.taggedProducts.length > 0 && (
                                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <ShoppingBag size={16} color="var(--accent-cyan)" />
                                        {post.taggedProducts.map(productId => (
                                            <Link
                                                key={productId}
                                                to={`/shop/${productId}`}
                                                style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--accent-cyan)',
                                                    textDecoration: 'none',
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'rgba(74, 222, 128, 0.1)',
                                                    borderRadius: '12px'
                                                }}
                                            >
                                                View Product
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: post.likes?.includes(user?._id) ? '#ef4444' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <Heart size={20} fill={post.likes?.includes(user?._id) ? '#ef4444' : 'none'} />
                                        {post.likes?.length || 0}
                                    </button>
                                    <button
                                        onClick={() => setSelectedPost(post._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <MessageCircle size={20} />
                                        {post.comments?.length || 0}
                                    </button>
                                </div>

                                {/* Comments */}
                                {post.comments && post.comments.length > 0 && (
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                                        {post.comments.slice(0, 2).map((comment, idx) => (
                                            <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                    {comment.user?.name}:
                                                </span>
                                                <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                                                    {comment.text}
                                                </span>
                                            </div>
                                        ))}
                                        {post.comments.length > 2 && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                                View all {post.comments.length} comments
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Add Comment */}
                                {selectedPost === post._id && user && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    handleComment(post._id, e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '4px',
                                                color: 'white'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No posts yet</p>
                        <p>Be the first to share your style!</p>
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <CreatePost
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={() => {
                        setShowCreatePost(false);
                        fetchPosts();
                    }}
                />
            )}
        </div>
    );
};

export default StyleWall;
