'use client';

import React, { useState, useEffect } from 'react';

// Força o Next.js a não fazer cache estático e ser dinâmico
export const dynamic = 'force-dynamic';

// --- MOCK MINIKIT (Simulação Segura de Pagamento) ---
const mockMiniKit = {
  // Usuário de teste
  user: { username: 'usuario_teste', fid: 123456 }, 
  // Função de pagamento simulada
  commands: {
    pay: async (amount: number) => {
      // Simula delay de rede de 1.5s
      return new Promise<{success: boolean}>((resolve) => setTimeout(() => resolve({ success: true }), 1500));
    }
  }
};

export default function Page() {
  
  // --- TRAVA DE SEGURANÇA (Mounting) ---
  const [isMounted, setIsMounted] = useState(false);

  // --- ESTADOS DO APP ---
  const [view, setView] = useState('home'); 
  const [targetUser, setTargetUser] = useState('');
  const [message, setMessage] = useState('');
  const [isFlirty, setIsFlirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); 
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null); 
  const [generatedMessage, setGeneratedMessage] = useState('');
  
  // --- EFEITO INICIAL ---
  useEffect(() => {
    setIsMounted(true);
    setGeneratedMessage('Você ilumina qualquer ambiente... (Exemplo)');
  }, []);

  // Se não estiver montado, retorna uma div preta para evitar flash de conteúdo
  if (!isMounted) {
    return (
      <div 
        style={{ 
          backgroundColor: '#000', 
          height: '100vh', 
          width: '100%', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 9999 
        }}
      >
        <div className="text-white text-center pt-20">Aguarde...</div>
      </div>
    );
  }

  // --- LÓGICA ---
  const handleSend = async () => {
    if (!targetUser || !message) return;
    setIsLoading(true);

    setTimeout(() => {
      let rewrote = message;
      if (isFlirty) {
        rewrote = `Ei @${targetUser}, não consigo parar de pensar no quanto você é atraente... ${message} 🔥😈`;
      } else {
        rewrote = `Olá @${targetUser}, alguém admira muito seu brilho... ${message} ✨💌`;
      }
      
      setGeneratedMessage(rewrote);
      setIsLoading(false);
      setView('sent');
    }, 2000);
  };

  const handlePay = async () => {
    setPaymentStatus('processing');
    try {
      const res = await mockMiniKit.commands.pay(0.1); 
      if (res.success) {
        setPaymentStatus('success');
        setTimeout(() => setView('game'), 1000);
      }
    } catch (e: any) {
      setPaymentStatus('idle');
      console.error('Erro simulado no pagamento:', e); 
    }
  };

  const handleGuess = () => {
    const realSender = 'usuario_teste'; 
    
    if (guess.toLowerCase() === realSender.toLowerCase()) {
      setGameResult('win');
      setView('result');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts === 0) {
        setGameResult('lose');
        setView('result');
      } else {
        console.log(`Errou! Restam ${newAttempts} tentativas.`); 
      }
    }
  };
  
  // --- LAYOUT ULTRA-AGRESSIVO ---
  // A cor de fundo aqui é **VERDE NEON** para garantir que você veja a mudança
  // e confirme que este arquivo está sendo renderizado no DOM.
  const topLevelStyle = { 
    backgroundColor: '#0f0', // VERDE NEON
    minHeight: '100vh', 
    color: '#000', 
    position: 'absolute' as 'absolute', // Garante que cobre tudo
    top: 0, 
    left: 0, 
    width: '100%', 
    zIndex: 99999 // Z-Index altíssimo
  };

  // --- TELAS ---
  
  const renderContent = () => {
    if (view === 'home') {
      return (
        <div className="w-full max-w-md space-y-8 p-6 bg-black/80 rounded-2xl border border-white/20">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tighter text-pink-400">
              Secret <span className="text-pink-600">Admirer</span>
            </h1>
            <p className="text-pink-200 text-lg">Envie flertes anônimos 💌</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-pink-300">Para quem?</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-3 text-gray-400">@</span>
                <input 
                  type="text" 
                  placeholder="username"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-pink-500 transition-all text-white"
                  value={targetUser}
                  onChange={(e: any) => setTargetUser(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-pink-300">Sua mensagem</label>
              <textarea 
                className="w-full mt-1 bg-black/50 border border-white/10 rounded-xl p-3 h-24 focus:outline-none focus:border-pink-500 transition-all resize-none text-white"
                placeholder="Escreva o que sente..."
                maxLength={280}
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
              />
              <div className="text-right text-xs text-gray-400">{message.length}/280</div>
            </div>

            <div 
              onClick={() => setIsFlirty(!isFlirty)}
              className="flex items-center justify-between bg-black/30 p-3 rounded-xl cursor-pointer border border-white/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl text-white">{isFlirty ? '🔥' : '😇'}</span>
                <span className="font-medium text-sm text-white">Modo Picante</span>
              </div>
              <button 
                className={`w-12 h-6 rounded-full transition-colors relative ${isFlirty ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isFlirty ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={handleSend}
              disabled={isLoading || !targetUser || !message}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <span>🔒</span> Enviar Anônimo
                </>
              )}
            </button>
          </div>

          <button 
            onClick={() => setView('inbox')}
            className="text-xs text-white/50 hover:text-white text-center w-full underline mt-4"
          >
            [Demo] Simular visão do Destinatário
          </button>
        </div>
      );
    }
    
    if (view === 'sent') {
      return (
        <div className="w-full max-w-md text-center p-6 bg-black/80 rounded-2xl border border-white/20 text-white">
          <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <span className="text-4xl text-green-400">✈️</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Enviado! 🤫</h2>
          <p className="text-gray-400 mb-8">Sua identidade está protegida criptograficamente.</p>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 max-w-xs w-full mx-auto mb-8">
            <p className="text-xs text-gray-500 uppercase mb-1">Prévia da IA:</p>
            <p className="italic text-pink-300">"{generatedMessage}"</p>
          </div>
          <button 
            onClick={() => { setMessage(''); setTargetUser(''); setView('home'); }} 
            className="text-pink-400 underline hover:text-pink-300"
          >
            Enviar outro
          </button>
        </div>
      );
    }

    if (view === 'inbox') {
      return (
        <div className="w-full max-w-md text-center p-6 bg-black/80 rounded-2xl border border-white/20 text-white">
          <span className="text-6xl animate-pulse mb-4 block">💕</span>
          <h1 className="text-3xl font-bold text-center mb-6">Você tem um Admirador Secreto!</h1>
          
          <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-pink-500/30 mb-8 relative overflow-hidden">
            <p className="text-xl font-serif text-center italic leading-relaxed text-pink-100">
              "{generatedMessage}"
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl w-full border border-yellow-500/30">
            <h3 className="text-yellow-400 font-bold flex items-center justify-center gap-2 mb-2">
              <span>❓</span> Quer saber quem foi?
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Você tem <span className="font-bold text-white">3 chances</span> para adivinhar.
            </p>
            
            <button 
              onClick={handlePay}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {paymentStatus === 'processing' ? 'Processando Pagamento...' : (
                <>
                  <span>💰</span> Pagar 0.1 USDC
                </>
              )}
            </button>
          </div>
          
          <button onClick={() => setView('home')} className="mt-8 text-sm text-gray-500 underline">Voltar ao início</button>
        </div>
      );
    }
    
    if (view === 'game') {
      return (
        <div className="w-full max-w-xs text-center p-6 bg-black/80 rounded-2xl border border-white/20 text-white">
          <h2 className="text-2xl font-bold mb-6">Quem mandou isso? 🤔</h2>
          
          <div className="text-center mb-6">
            <span className="text-5xl font-mono text-pink-500">{attempts}</span>
            <p className="text-sm text-gray-400">Tentativas restantes</p>
          </div>

          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-gray-500">@</span>
            <input 
              type="text" 
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-8 pr-4 focus:border-pink-500 outline-none text-lg text-white"
              placeholder="username"
              value={guess}
              onChange={(e: any) => setGuess(e.target.value)}
            />
          </div>

          <button 
            onClick={handleGuess}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 active:scale-95 transition-transform"
          >
            Verificar
          </button>
        </div>
      );
    }

    if (view === 'result') {
      return (
        <div className={`p-8 rounded-xl shadow-2xl text-center border text-white ${gameResult === 'win' ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'}`}>
          {gameResult === 'win' ? (
            <>
              <span className="text-6xl mb-4 block">🎉</span>
              <h1 className="text-4xl font-bold mb-2 text-green-300">ACERTOU!</h1>
              <p className="text-xl mb-8">Foi o <span className="font-bold text-yellow-300">@usuario_teste</span>!</p>
            </>
          ) : (
            <>
              <span className="text-6xl mb-4 block">❌</span>
              <h1 className="text-4xl font-bold mb-2 text-red-300">PERDEU!</h1>
              <p className="text-xl mb-8">Suas tentativas acabaram.</p>
              <p className="text-lg text-yellow-200">O USDC ficou com o criador.</p>
            </>
          )}
          <button 
            onClick={() => {
              setAttempts(3);
              setGuess('');
              setGameResult(null);
              setView('home'); 
            }} 
            className="mt-6 bg-white/20 px-6 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      );
    }

    return null;
  };
  
  // O componente principal. Se este fundo VERDE aparecer, o seu código está sendo executado corretamente!
  return (
    <div style={topLevelStyle} className="p-6 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-md">
            {renderContent()}
        </div>
    </div>
  );
}