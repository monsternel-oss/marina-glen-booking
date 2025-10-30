import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingPreviewPageRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      // Preserve any query params (for example: id=B0001) and ensure mode=view if not provided
      const params = new URLSearchParams(location.search);
      if (!params.has('mode')) params.set('mode', 'view');
      const search = params.toString();
      navigate(`/booking-form?${search}`, { replace: true });
    } catch (err) {
      // Fallback to the default route if anything goes wrong
      navigate('/booking-form?mode=view', { replace: true });
    }
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to booking preview...</p>
      </div>
    </div>
  );
};

export default BookingPreviewPageRedirect;