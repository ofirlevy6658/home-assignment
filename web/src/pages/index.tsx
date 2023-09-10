import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { Loader2 } from "lucide-react";

const sleep = (ms:number) => new Promise(res => {setTimeout(res, ms);});

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.replace('/login');
        }
    }, [router]);

    const symbols = ['🍎', '🍊', '🍇', '💰'];  
    const [slots, setSlots] = useState(['', '', '']);
    const [result, setResult] = useState<string | undefined>();
    const [showSadEmoji, setShowSadEmoji] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    const fireConfetti = () => {
        confetti({
            particleCount: 300,
            spread: 200,
            origin: { x: 0.5, y: 0.5 }
        });
    };

    const handleLottery = async () => {
        setIsLoading(true);
        
        const t = localStorage.getItem("token");
        const response = await fetch("/api/try_luck", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${t}`
            }
        });
    
        const data = await response.json();
    
        let newSlots;
    
        if (data.win) {
            newSlots = ['💰', '💰', '💰'];
            fireConfetti();
            setResult('You win!');
            setShowSadEmoji(false);
        } else {
            newSlots = [
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ];
            setResult('You lose!');
            setShowSadEmoji(true);
        }
    
        setSlots(newSlots);
        setIsLoading(false);
    };
    
    

    const resetGame = () => {
        setResult(undefined);
        setShowSadEmoji(false);
        setSlots(['', '', '']);
    };


    const handleLogout = async () => {
        const t = localStorage.getItem("token");
        
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${t}`
            }
        });
        const jRes = await response.json();
    
        if (jRes === "OK") {
            localStorage.removeItem("token");
            router.push('/login');
        }
    };
    
    
    return (
        <div className="container">
            <Button 
                className="Button"
                style={{ position: 'absolute', top: '10px', left: '10px' }} 
                onClick={handleLogout}
            >
                Logout
            </Button>
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
                <Button className="Button" disabled={isLoading} onClick={resetGame}>Try Again</Button>
                </>
            ) : (
                <>
                <p>Click the button below to see if you win!</p>
                {isLoading ? (
                    <Button disabled>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Please wait
                    </Button>
                ) : (
                    <Button className="Button" onClick={handleLottery}>Try your luck</Button>
                )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
