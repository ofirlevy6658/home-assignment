import { useState } from 'react';
import confetti from 'canvas-confetti';

const Dashboard = () => {
    const symbols = ['🍎', '🍊', '🍇'];
    const [slots, setSlots] = useState(['', '', '']);
    const [result, setResult] = useState<string>();
    const [showSadEmoji, setShowSadEmoji] = useState(false);

    const fireConfetti = () => {
        // Fire from the center
        confetti({
            particleCount: 300,
            spread: 200,
            origin: { x: 0.5, y: 0.5 }
        });
    };

    const handleLottery = () => {
        const newSlots = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
        ];
        setSlots(newSlots);

        if (newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2]) {
            fireConfetti();
            setResult('You win!');
            setShowSadEmoji(false);
        } else {
            setResult('You lose!');
            setShowSadEmoji(true);
        }
    };

    const resetGame = () => {
        setResult(undefined);
        setShowSadEmoji(false);
        setSlots(['', '', '']);
    };

    return (
        <div className="container">
            <h1>Welcome to the Lottery Page!</h1>
            
            <div className="slots">
                {slots.map((slot, index) => (
                    <span key={index} className="slot-symbol">{slot}</span>
                ))}
            </div>

            {result ? (
                <>
                <h2>{result}</h2>
                {showSadEmoji && <div style={{ fontSize: '50px' }}>😢</div>}
                <button onClick={resetGame}>Try Again</button>
                </>
            ) : (
                <>
                <p>Click the button below to see if you win!</p>
                <button onClick={handleLottery}>Try your luck</button>
                </>
            )}
        </div>
    );
};

export default Dashboard;
