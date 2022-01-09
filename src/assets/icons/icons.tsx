import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export const TimerIcon: React.FC<SVGProps> = ({color,...props}) => (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 29C23.4036 29 29 23.4036 29 16.5C29 9.59644 23.4036 4 16.5 4C9.59644 4 4 9.59644 4 16.5C4 23.4036 9.59644 29 16.5 29ZM16.5 33C25.6127 33 33 25.6127 33 16.5C33 7.3873 25.6127 0 16.5 0C7.3873 0 0 7.3873 0 16.5C0 25.6127 7.3873 33 16.5 33Z" fill={color}/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0221 15.1525C15.7663 14.3363 17.0313 14.2779 17.8475 15.0221L22.2823 19.0656C23.0986 19.8098 23.1569 21.0748 22.4127 21.891C21.6685 22.7072 20.4035 22.7656 19.5873 22.0214L15.1525 17.9779C14.3363 17.2337 14.2779 15.9687 15.0221 15.1525Z" fill={color}/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 18C14.8954 18 14 17.1046 14 16L14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8L18 16C18 17.1046 17.1046 18 16 18Z" fill={color}/>
    </svg>
    
);

export const ArrowIcon: React.FC<SVGProps> = ({color,...props}) => (
    <svg width="12" height="32" viewBox="0 0 12 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.46967 31.5303C5.76256 31.8232 6.23744 31.8232 6.53033 31.5303L11.3033 26.7574C11.5962 26.4645 11.5962 25.9896 11.3033 25.6967C11.0104 25.4038 10.5355 25.4038 10.2426 25.6967L6 29.9393L1.75736 25.6967C1.46446 25.4038 0.989591 25.4038 0.696698 25.6967C0.403805 25.9896 0.403805 26.4645 0.696698 26.7574L5.46967 31.5303ZM5.25 -3.27835e-08L5.25 31L6.75 31L6.75 3.27835e-08L5.25 -3.27835e-08Z" fill={color}/>
    </svg>
);




