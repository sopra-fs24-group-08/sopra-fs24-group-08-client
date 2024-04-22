const askTurnDecision = (gameId) => {
    const accept = () => {
        // Handle acceptance logic, e.g., send decision to server
        toast.dismiss(); // Close the toast after decision
        console.log("User chose to go first.");
    };

    const reject = () => {
        // Handle rejection logic, e.g., send decision to server
        toast.dismiss(); // Close the toast after decision
        console.log("User chose to go second.");
    };

    toast(
        ({ closeToast }) => (
            <div>
                <h4>Do you want to go first?</h4>
                <button onClick={accept}>Yes</button>
                <button onClick={reject}>No</button>
            </div>
        ),
        {
            position: "top-center",
            autoClose: false, // Prevent automatic closing
            closeOnClick: false,
            draggable: false,
        }
    );
};
