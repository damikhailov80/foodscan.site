'use client';

import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  style,
  ...props 
}: ButtonProps) {
  const variantClass = variant === 'secondary' ? styles.buttonSecondary : '';
  
  return (
    <button 
      className={`${styles.button} ${variantClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
