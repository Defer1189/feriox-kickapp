import ScopeData from '../components/ScopeData';
import './Dashboard.css';

function Dashboard() {
  const scopes = [
    { scope: 'user:read', title: 'User Profile', icon: '👤' },
    { scope: 'channel:read', title: 'Channel Data', icon: '📺' },
    { scope: 'streamkey:read', title: 'Stream Key', icon: '🔑' },
    { scope: 'channel:write', title: 'Channel Management', icon: '✏️' },
    { scope: 'chat:write', title: 'Chat', icon: '💬' },
    { scope: 'events:subscribe', title: 'Events', icon: '📡' },
    { scope: 'moderation:ban', title: 'Moderation', icon: '🛡️' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>KICK API Dashboard</h2>
        <p>Explore data from each authorized scope</p>
      </div>

      <div className="scopes-container">
        {scopes.map((item) => (
          <ScopeData
            key={item.scope}
            scope={item.scope}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
