'use client';

import { toast } from 'react-hot-toast';

const NotifyButton = () => {
    const notify = () => {
        toast.success('Success message!', {
            duration: 3000, // Display duration in milliseconds
            position: 'top-center', // Change toast position
            style: {
                // Customize style
                border: '2px solid #ffffff',
                color: '#000000',
                backgroundColor: '#ffffff',
            },
        });
    };

    return (
        <button onClick={notify}>Notify</button>
    );
};

export default NotifyButton;
