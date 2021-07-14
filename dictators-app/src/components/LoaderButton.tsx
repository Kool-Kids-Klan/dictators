import React from 'react';
import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

const LoaderButton = ({
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) => (
  <Button
    disabled={disabled || isLoading}
    className={`LoaderButton ${className}`}
    {...props}
  >
    {isLoading && <BsArrowRepeat className="spinning" />}
    {props.children}
  </Button>
);

export default LoaderButton;
