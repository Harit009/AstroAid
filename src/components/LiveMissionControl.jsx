"use client";

import { useState, useEffect } from 'react';
import { Satellite, Rocket } from 'lucide-react';

const CountdownTimer = ({ launchDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    if (!launchDate) {
        setTimeLeft('TBD');
        return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(launchDate) - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        setIsAlert(difference < 24 * 60 * 60 * 1000); 
      } else {
        setTimeLeft('LAUNCHED');
        setIsAlert(false);
      }
    };

    calculateTimeLeft(); 
    const timer = setInterval(calculateTimeLeft, 60000); 
    return () => clearInterval(timer);
  }, [launchDate]);

  return { timeLeft, isAlert };
};

const LaunchCard = ({ launch }) => {
  const { timeLeft, isAlert } = CountdownTimer({ launchDate: launch.net });

  return (
    <div className={`glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col h-full ${isAlert ? 'border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse' : ''}`}>
      {isAlert && (
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-800 text-white text-xs font-black uppercase tracking-widest z-10 shadow-lg animate-pulse">
              Red Alert
          </div>
      )}
      
      {/* Background Graphic */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none"></div>
      {isAlert && <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6 gap-2">
            <h4 className="text-xl font-bold glass-title leading-snug drop-shadow-md">{launch.name}</h4>
            <Rocket className="w-5 h-5 text-[#AAAAAA] flex-shrink-0" />
        </div>
        
        <p className="text-[#AAAAAA] text-sm font-medium flex items-center gap-2 mb-6">
          <span className="opacity-80">🛰️</span> {launch.rocket?.configuration?.name || 'Unknown Rocket'}
        </p>

        <div className="mt-auto pt-6 text-center w-full">
            <p className="text-[10px] text-[#AAAAAA] font-bold uppercase tracking-widest mb-1.5">Live Countdown</p>
            <p className={`font-mono text-2xl font-black tracking-widest drop-shadow-[0_0_8px_rgba(0,229,255,0.4)] ${isAlert ? 'text-red-400' : 'text-[#00E5FF]'}`}>
                {timeLeft || 'CALCULATING...'}
            </p>
        </div>
      </div>
    </div>
  );
};

const IssPositionNode = () => {
  const [issData, setIssData] = useState(null);
  
  useEffect(() => {
    const fetchIss = async () => {
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        setIssData(data.iss_position);
      } catch (err) {}
    };
    fetchIss();
    const interval = setInterval(fetchIss, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00E5FF]/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-xl font-bold glass-title leading-snug drop-shadow-md">ISS Telemetry</h4>
          <Satellite className="w-6 h-6 text-[#00E5FF] animate-pulse drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
        </div>
        
        <p className="text-[#AAAAAA] text-sm font-medium mb-6 flex-1">
          Real-time orbital tracking coordinates of the International Space Station.
        </p>

        <div className="mt-auto pt-6 w-full flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[#AAAAAA] font-bold uppercase tracking-widest">Target Latitude</p>
              <p className="font-mono text-lg font-black tracking-widest text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">
                  {issData?.latitude ? parseFloat(issData.latitude).toFixed(4) : '---.----'}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[#AAAAAA] font-bold uppercase tracking-widest">Target Longitude</p>
              <p className="font-mono text-lg font-black tracking-widest text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">
                  {issData?.longitude ? parseFloat(issData.longitude).toFixed(4) : '---.----'}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function LiveMissionControl() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=2');
        if (!response.ok) throw new Error('Failed to fetch from Space Devs API');
        const data = await response.json();
        setLaunches(data.results || []);
      } catch (err) {
        console.error("Failed to fetch launches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <div className="glass-card flex justify-center items-center p-12 rounded-3xl">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,229,255,0.5)]"></div>
                <p className="text-[#00E5FF] font-mono text-sm tracking-widest uppercase animate-pulse">Establishing Uplink...</p>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IssPositionNode />
          {launches.map((launch, index) => (
            <LaunchCard key={launch.id || `launch-${index}`} launch={launch} />
          ))}
        </div>
      )}
    </div>
  );
}
