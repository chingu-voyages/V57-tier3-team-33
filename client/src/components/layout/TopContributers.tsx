
interface Contributor {
  name: string;
  prsCreated: number;
  prsMerged: number;
  successRate: string;
}

export default function TopContributers() {
  const contributors: Contributor[] = [
    { name: "John Doe", prsCreated: 15, prsMerged: 12, successRate: "80%" },
    { name: "Jane Smith", prsCreated: 10, prsMerged: 9, successRate: "90%" },
    { name: "Peter Jones", prsCreated: 20, prsMerged: 10, successRate: "50%" },
    { name: "Alice Brown", prsCreated: 8, prsMerged: 8, successRate: "100%" },
  ];

  return (
    <main className="max-w-screen-xl mx-auto py-8 px-4">
      <h3 className="text-3xl font-bold text-gray-800 mb-6">Top Contributors</h3>
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto"> {/* Responsive table container */}
        {contributors.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PRs Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PRs Merged
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributors.map((contributor, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contributor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contributor.prsCreated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contributor.prsMerged}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contributor.successRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">No data available</div>
        )}
      </div>
    </main>
  );
}
