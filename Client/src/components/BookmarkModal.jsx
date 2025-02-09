import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const BookmarkModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Sample data - replace with actual data from your backend
    const sampleProjects = [
        { id: 1, name: "E-commerce Assistant", bookmarks: [
            { id: 1, prompt: "Create a product description for a luxury watch" },
            { id: 2, prompt: "Generate SEO keywords for fashion items" }
        ]},
        { id: 2, name: "Content Writer", bookmarks: [
            { id: 3, prompt: "Write a blog post about AI trends" },
            { id: 4, prompt: "Create social media captions" }
        ]}
    ];

    const [selectedProject, setSelectedProject] = useState(sampleProjects[0]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Bookmarked Prompts</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    {/* Left Column - Projects */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-700">
                        <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            <ul className="space-y-2 p-4">
                                {sampleProjects.map((project) => (
                                    <li key={project.id}>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left 
                                                transition-colors ${
                                                selectedProject.id === project.id
                                                    ? 'bg-gray-700 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                                }`}
                                        >
                                            {project.name}
                                            <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">
                                                {project.bookmarks.length}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Right Column - Bookmarked Prompts */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <h3 className="text-lg font-medium text-white p-6 pb-4">{selectedProject.name}</h3>
                        <div className="flex-1 overflow-y-auto p-6 pt-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            <div className="space-y-4">
                                {selectedProject.bookmarks.map((bookmark) => (
                                    <div key={bookmark.id} className="bg-gray-700 p-4 rounded-lg">
                                        <p className="text-white">{bookmark.prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookmarkModal;
