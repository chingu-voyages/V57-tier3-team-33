import React from 'react'

interface ChildFormProps {
    handleSubmit: (owner: string, repository: string) => void;
    isLoading: boolean
}

const RepoForm: React.FC<ChildFormProps> = ({ handleSubmit, isLoading }) => {
    const inputs = [
        {
            id: "owner",
            label: "Repository Owner",
            type: "text",
            placeholder: "Repository Owner"
        },
        {
            id: "repository",
            label: "Repository",
            type: "text",
            placeholder: "Repository"
        },
    ]

    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const owner = formData.get("owner") as string;
        const repository = formData.get("repository") as string;

        handleSubmit(owner, repository);
    };

    return (
        <form
            onSubmit={formSubmitHandler}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
                <label
                    htmlFor="owner"
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    Repository Owner
                </label>
                <input
                    type="text"
                    id="owner"
                    name="owner"
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Repository Owner"
                    required
                />
            </div>
            <div className="flex flex-col">
                <label
                    htmlFor="repository"
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    Repository
                </label>
                <input
                    type="text"
                    id="repository"
                    name="repository"
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Repository Name"
                    required
                />
            </div>
            <input
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                value={`Apply ${isLoading && "..."}`}
            />

        </form>
    )
}

export default RepoForm
