import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import tonLogo from './ton.svg';
import usdtLogo from './usdt.svg';
import RGcoinLogo from '/RGcoinlogo.jpg';

const PRESALE_SUPPLY = 20000;
const MIN_PURCHASE = 1;  // Минимальная покупка в USDT
const MAX_PURCHASE = 1000;  // Максимальная покупка в USDT
const CURRENT_PROGRESS = 8520;
const TOKEN_PRICE = 10;  // 1 RAP = 10 USDT

function App() {
  const { connected } = useTonConnect();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      setIsInitialized(true);
    } catch (e) {
      console.error('WebApp initialization error:', e);
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="Container LoadingContainer">
        <div className="LoadingContent">
          <img src="/RGcoinlogo.jpg" alt="RAP Logo" className="LoadingLogo" />
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  const handlePresale = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const numAmount = Number(amount);
    if (numAmount < MIN_PURCHASE) {
      setError(`Minimum purchase amount is ${MIN_PURCHASE} USDT`);
      return;
    }
    if (numAmount > MAX_PURCHASE) {
      setError(`Maximum purchase amount is ${MAX_PURCHASE} USDT`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Здесь будет логика покупки токенов
      await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация запроса
      console.log('Purchase successful:', amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getExpectedOutput = (input: string): string => {
    if (!input || isNaN(Number(input))) return '0.00';
    return (Number(input) * 0.1).toFixed(2);
  };

  const progressPercentage = (CURRENT_PROGRESS / PRESALE_SUPPLY) * 100;

  return (
    <div className="Container">
      <div className="AppHeader">
        <img src={RGcoinLogo} alt="RAP Game" className="HeaderLogo" />
        <div className="HeaderTitle">
          <h1>RAPGAME</h1>
          <p>Presale</p>
        </div>
      </div>

      <div className="MainWrapper">
        <div className="MainContent">
          {/* Секция обмена */}
          <div className="SwapSection">
            <div className="SwapCard">
              <div className="SwapHeader">
                <span>Pay with</span>
                <span className="Balance">Balance: 0.00 USDT</span>
              </div>
              <div className="SwapInput">
                <input
                  type="number"
                  id="amount-input"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="AmountInput"
                />
                <div className="TokenSelect">
                  <img src={usdtLogo} alt="USDT" className="TokenLogo" />
                  <span>USDT</span>
                </div>
              </div>
            </div>

            <div className="SwapArrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 16L7 11H17L12 16Z" fill="currentColor"/>
              </svg>
            </div>

            <div className="SwapCard">
              <div className="SwapHeader">
                <span>You receive</span>
                <span className="Balance">Balance: 0.00 RAP</span>
              </div>
              <div className="SwapInput">
                <div className="AmountInput ReadOnly">
                  {getExpectedOutput(amount)}
                </div>
                <div className="TokenSelect">
                  <img src={RGcoinLogo} alt="RAP" className="TokenLogo" />
                  <span>RAP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="ButtonsSection">
            {!connected ? (
              <div className="ConnectButtonWrapper">
                <TonConnectButton />
              </div>
            ) : (
              <button 
                className={`PresaleButton ${isLoading ? 'loading' : ''}`}
                onClick={handlePresale}
                disabled={!amount || isLoading}
              >
                {isLoading ? (
                  <span className="LoadingText">
                    Processing...
                    <div className="LoadingDots">
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </span>
                ) : (
                  'Buy RAP Tokens'
                )}
              </button>
            )}
          </div>

          {/* Секция прогресса */}
          <div className="ProgressSection">
            <div className="ProgressHeader">
              <span>Presale Progress</span>
              <span className="ProgressPercentage">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="ProgressBar">
              <div 
                className="ProgressFill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="ProgressInfo">
              <span>{CURRENT_PROGRESS.toLocaleString()} / {PRESALE_SUPPLY.toLocaleString()} RAP</span>
              <span>{(PRESALE_SUPPLY - CURRENT_PROGRESS).toLocaleString()} RAP left</span>
            </div>
          </div>

          {error && <div className="ErrorMessage">{error}</div>}
        </div>
      </div>

      {/* Информационная карточка */}
      <div className="InfoCard">
        <div className="InfoHeader">
          <img src={RGcoinLogo} alt="RAP" className="InfoLogo" />
          <div>
            <h2>RAP Token</h2>
            <p>Играй по свои правилам</p>
          </div>
        </div>
        <div className="InfoGrid">
          <div className="InfoItem">
            <span>Min Purchase</span>
            <span>1 USDT</span>
          </div>
          <div className="InfoItem">
            <span>Max Purchase</span>
            <span>1,000 USDT</span>
          </div>
          <div className="InfoItem">
            <span>Token Price</span>
            <span>10 USDT</span>
          </div>
          <div className="InfoItem">
            <span>Total Supply</span>
            <span>200,000 RAP</span>
          </div>
          <div className="InfoItem">
            <span>Presale Supply</span>
            <span>20,000 RAP</span>
          </div>
          <div className="InfoItem">
            <span>Expected Growth</span>
            <span className="GrowthPercentage">+322%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
