import React from 'react';
import { BeerPost, BreweryPost } from './types';

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);


export const LanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
  </svg>
);

export const BeerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c1.121-1.602 4.102-1.602 5.223 0s1.602 4.102 0 5.223c-1.602 1.121-1.602 4.102 0 5.223s-4.102 1.602-5.223 0-4.102-1.602-5.223 0-1.602-4.102 0-5.223c1.602-1.121 1.602-4.102 0-5.223s4.102-1.602 5.223 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6v14.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9.75c0 1.242-1.008 2.25-2.25 2.25h-1.5" />
    </svg>
);


export const BreweryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21" />
    </svg>
);

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.586.079a2.25 2.25 0 012.088 2.088c.029.196.054.391.079.586m0 0a2.25 2.25 0 002.186 0m-2.186 0c-.196-.029-.391-.054-.586-.079a2.25 2.25 0 00-2.088-2.088c-.029-.195-.05-.39-.079-.586m0 0a2.25 2.25 0 000-2.186m2.186 0a2.25 2.25 0 012.088 2.088c.029.196.054.391.079.586m-2.186 0c.196.029.391.054.586.079a2.25 2.25 0 012.088 2.088c.029.196.054.391.079.586M12 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export const DirectionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.024.217 1.465l-.32.426a.75.75 0 01-1.04.217l-1.068-.89a.75.75 0 00-.95-.086l-1.068.89a.75.75 0 00-.217 1.04l.32.426c.318.441.225 1.096-.217 1.465l-1.068.89a.75.75 0 00-.405.864v.568a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.568a.75.75 0 00-.405-.864l-1.068-.89a.75.75 0 01-.217-1.04l.32-.426c.318.441.225-1.096-.217-1.465l-1.068-.89a.75.75 0 01.95.086l1.068-.89a.75.75 0 011.04-.217l.32.426c.318.441.411 1.096-.044 1.465l-1.068.89a.75.75 0 00-.405.864v.568a.75.75 0 00.75.75h.568a.75.75 0 00.864-.405l.89-1.068a.75.75 0 011.04-.217l.426.32a.75.75 0 001.465-.217l.89-1.068a.75.75 0 00.405-.864v-4.5a.75.75 0 00-.75-.75h-.568a.75.75 0 00-.864.405l-.89 1.068a.75.75 0 01-1.04.217l-.426-.32a.75.75 0 00-1.465.217l-.89 1.068a.75.75 0 00-.405.864v.568a.75.75 0 00.75.75h.568c.334 0 .65-.148.864-.405l.89-1.068a.75.75 0 011.04-.217l1.068.89c.441.318 1.096.225 1.465-.217l.426-.32a.75.75 0 00.217-1.04l-1.068-.89a.75.75 0 01-.086-.95l.89-1.068a.75.75 0 00-.217-1.04l.32.426a.75.75 0 001.465-.217l.89-1.068a.75.75 0 01.95-.086l.89 1.068c.318.441.973.535 1.465.217l1.068-.89c.441-.318.535-.973.217-1.465l-.32-.426a.75.75 0 00-1.04-.217l-.89 1.068a.75.75 0 01-.95.086l-.89-1.068a.75.75 0 01-.217-1.04l.32-.426c.318-.441.225-1.096-.217-1.465l-1.068-.89a.75.75 0 00-.864.405l-.568.568a.75.75 0 00.75.75h.568a.75.75 0 00.864-.405l.89-1.068a.75.75 0 011.04-.217l.426.32c.441.318 1.096.225 1.465-.217l.89-1.068a.75.75 0 00.405-.864V3.03a.75.75 0 00-.75-.75H13.5a.75.75 0 00-.75.75z" />
  </svg>
);

export const CommentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);