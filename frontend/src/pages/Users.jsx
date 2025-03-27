export default function Users() {
    const users = [
      { id: 1, user: "Bob" },
      { id: 2, user: "Alice" },
      { id: 3, user: "Charlie" },
      { id: 4, user: "David" },
      { id: 5, user: "Eve" }
    ];
  
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <pre className="text-left bg-gray-100 p-4 rounded">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    );
  }