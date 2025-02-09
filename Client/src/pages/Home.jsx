import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import { FaUserAlt } from "react-icons/fa";
import axios from "../config/axios";
import { useNavigate, Link } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';
import { BsBookmarkFill } from 'react-icons/bs';
import BookmarkModal from '../components/BookmarkModal';

const Home = () => {
    const { user, logout } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [project, setProject] = useState([]);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

    const navigate = useNavigate();

    function createProject(e) {
        e.preventDefault();

        axios.post('/projects/create', {
            name: projectName,
        }).then((response) => {
            setIsModalOpen(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        axios.get('/projects/all').then((response) => {
            setProject(response.data.projects);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            try {
                const response = await axios.get('/subscription/details');
                if (response.data?.plan) {
                    setSubscriptionInfo(response.data);
                } else {
                    console.error('Invalid subscription data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching subscription details:', error.response?.data || error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptionDetails();
    }, []);

    const getPlanBadgeColor = (plan) => {
        switch (plan?.toLowerCase()) {
            case 'pro':
                return 'bg-purple-600';
            case 'enterprise':
                return 'bg-yellow-600';
            default:
                return 'bg-gray-600';
        }
    };

    const headerButtons = (
        <div className="flex gap-4">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
            >
                <AiOutlinePlus className="text-xl" />
                New Project
            </button>
            <button
                onClick={() => setIsBookmarkModalOpen(true)}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                title="Bookmarks"
            >
                <BsBookmarkFill className="text-xl" />
            </button>
            <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                title="Profile Settings"
            >
                <FaUserAlt className="text-xl" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">BUTO.ai</h1>
                        {isLoading ? (
                            <div className="h-6 w-16 bg-gray-700 animate-pulse rounded-full self-center"/>
                        ) : (
                            <span 
                                className={`${getPlanBadgeColor(subscriptionInfo?.plan)} 
                                px-2 py-1 mt-2 rounded-full text-xs font-semibold text-white capitalize justify-center flex items-center`}
                            >
                                {subscriptionInfo?.plan || 'Free'}
                            </span>
                        )}
                    </div>
                    {headerButtons}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {project.map((project) => (
                        <div key={project._id} onClick={() => navigate(`/project`, { state: { project } })} className="bg-gray-800 flex justify-between items-center rounded-lg p-6 hover:bg-gray-700 transition-colors">
                            <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                            <span className='text-white flex gap-2 justify-center items-center'>
                                <FaUserAlt /> {project.users.length}
                            </span>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Create New Project</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <AiOutlineClose size={24} />
                                </button>
                            </div>
                            <form onSubmit={createProject}>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Enter project name"
                                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Create Project
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <BookmarkModal
                    isOpen={isBookmarkModalOpen}
                    onClose={() => setIsBookmarkModalOpen(false)}
                />

                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                    onLogout={handleLogout}
                />
            </div>
        </div>
    )
}

export default Home