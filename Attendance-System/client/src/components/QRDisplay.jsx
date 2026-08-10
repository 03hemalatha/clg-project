import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function QRDisplay({ token }) {
  // 🕒 10 minutes total = 600 seconds
  const SESSION_DURATION_SECS = 600; 
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SECS);
  
  useEffect(() => {
    // 🔄 Sync and reset the visual countdown to 10:00 every time 
    // the backend socket sends a brand new QR token string!
    setTimeLeft(SESSION_DURATION_SECS);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return SESSION_DURATION_SECS;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [token]); // Watches the Socket token changes

  // 📊 Helper function to display MM:SS instead of raw numbers
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!token) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-muted-foreground">No QR code available</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 bg-white rounded-lg">
        <QRCodeSVG value={token} size={256} level="H" />
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <RefreshCw size={16} className="animate-spin" />
        {/* Displays beautifully from 10:00 down to 0:00 */}
        <span>Refreshes in {formatTime(timeLeft)}</span>
      </div>
      
      <p className="text-xs text-center text-muted-foreground max-w-xs">
        Students must scan this QR code to mark their attendance
      </p>
    </div>
  );
}
