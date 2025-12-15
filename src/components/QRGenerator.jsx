import { useState, useRef, useCallback, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { generatePromptPayPayload } from '../utils/promptpay';
import { validateMobileNumber, validateNationalId, validateAmount } from '../utils/validation';

// Icons as SVG components - Minimal style
const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const IdCardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="6" y1="9" x2="6" y2="9" />
        <line x1="10" y1="9" x2="18" y2="9" />
        <line x1="6" y1="13" x2="18" y2="13" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function QRGenerator() {
    const [inputType, setInputType] = useState('mobile');
    const [inputValue, setInputValue] = useState('');
    const [amount, setAmount] = useState('');
    const [payload, setPayload] = useState('');
    const [error, setError] = useState(null);
    const [amountError, setAmountError] = useState(null);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef(null);

    // Validate and generate payload
    useEffect(() => {
        const validation = inputType === 'mobile'
            ? validateMobileNumber(inputValue)
            : validateNationalId(inputValue);

        const amountValidation = validateAmount(amount);

        setError(validation.error);
        setAmountError(amountValidation.error);

        if (validation.valid && amountValidation.valid && inputValue.length > 0) {
            const newPayload = generatePromptPayPayload(
                inputValue.replace(/\D/g, ''),
                inputType,
                amount || null
            );
            setPayload(newPayload);
        } else {
            setPayload('');
        }
    }, [inputValue, inputType, amount]);

    const handleTypeChange = (type) => {
        setInputType(type);
        setInputValue('');
        setAmount('');
        setError(null);
        setAmountError(null);
    };

    const downloadQR = useCallback(() => {
        if (!qrRef.current) return;

        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const padding = 40;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width + padding * 2;
        newCanvas.height = canvas.height + padding * 2;

        const ctx = newCanvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
        ctx.drawImage(canvas, padding, padding);

        const link = document.createElement('a');
        link.download = `promptpay-qr-${Date.now()}.png`;
        link.href = newCanvas.toDataURL('image/png');
        link.click();
    }, []);

    const copyPayload = useCallback(async () => {
        if (!payload) return;

        try {
            await navigator.clipboard.writeText(payload);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [payload]);

    const isValid = payload.length > 0;
    const placeholder = inputType === 'mobile' ? '0812345678' : '1234567890123';
    const inputLabel = inputType === 'mobile' ? 'เบอร์โทรศัพท์' : 'เลขบัตรประชาชน';

    return (
        <div className=" w-full max-w-md p-6 sm:p-8 fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    PromptPay QR
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    สร้าง QR Code พร้อมเพย์ได้ทันที
                </p>
            </div>

            {/* Input Type Toggle */}
            <div className="toggle-container mb-6">
                <button
                    className={`toggle-btn ${inputType === 'mobile' ? 'active' : ''}`}
                    onClick={() => handleTypeChange('mobile')}
                >
                    <PhoneIcon />
                    <span>เบอร์โทร</span>
                </button>
                <button
                    className={`toggle-btn ${inputType === 'nationalId' ? 'active' : ''}`}
                    onClick={() => handleTypeChange('nationalId')}
                >
                    <IdCardIcon />
                    <span>บัตรประชาชน</span>
                </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-5 mb-6 p-8">
                {/* ID/Mobile Input */}
                <div className="input-group">
                    <label className="input-label">{inputLabel}</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className={`input-field ${error ? 'error' : isValid ? 'success' : ''}`}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                        maxLength={inputType === 'mobile' ? 10 : 13}
                    />
                    {error && <p className="error-message">⚠ {error}</p>}
                </div>

                {/* Amount Input */}
                <div className="input-group">
                    <label className="input-label">
                        จำนวนเงิน (บาท) <span className="text-gray-400 font-normal">— ไม่บังคับ</span>
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        className={`input-field ${amountError ? 'error' : ''}`}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            const parts = value.split('.');
                            if (parts.length > 2) return;
                            if (parts[1] && parts[1].length > 2) return;
                            setAmount(value);
                        }}
                    />
                    {amountError && <p className="error-message">⚠ {amountError}</p>}
                    <p className="text-xs text-red-400 mt-2">
                        เว้นว่างไว้เพื่อให้ผู้จ่ายกรอกจำนวนเงินเอง
                    </p>
                </div>
            </div>

            {/* QR Code Display */}
            <div className="qr-container" ref={qrRef}>
                {isValid ? (
                    <QRCodeCanvas
                        value={payload}
                        size={200}
                        level="M"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                ) : (
                    <div className="qr-placeholder">
                        กรอก{inputType === 'mobile' ? 'เบอร์โทรศัพท์' : 'เลขบัตรประชาชน'}เพื่อสร้าง QR Code
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center">
                <button
                    className="btn btn-primary"
                    onClick={downloadQR}
                    disabled={!isValid}
                >
                    <DownloadIcon />
                    ดาวน์โหลด
                </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-center text-red-400 mt-8">
                ข้อมูลทั้งหมดประมวลผลบนเครื่องของคุณ ไม่มีการส่งไปเซิร์ฟเวอร์
            </p>
        </div>
    );
}
