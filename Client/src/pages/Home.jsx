import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import axios from "../config/axios";
import { FaUserAlt } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Home = () => {
    const { user, logout } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [project, setProject] = useState([]);

    const navigate = useNavigate();

    function createProject(e) {
        e.preventDefault();
        console.log(projectName);

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

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">BUTO.ai</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            <AiOutlinePlus className="text-xl" />
                            New Project
                        </button>
                        <button
                            onClick={handleLogout}
                            title="Log out"
                            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                        >
                            <FiLogOut className="text-xl" />
                        </button>
                    </div>
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
            </div>
        </div>
    )
}

export default Home