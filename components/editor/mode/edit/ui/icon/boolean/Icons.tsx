import BooleanOperation from "@/lib/replicad/model/BooleanOperation";

const ICONS = {
  [BooleanOperation.UNION]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      id="svg1"
      fill="#DA4167"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        d="M 3.5839844,3.3886719 V 15.099609 h 4.1992187 c 0.2188109,2.831376 2.7310469,5.062018 5.4511719,5.496094 1.870142,0.360584 3.865526,-0.211482 5.255859,-1.511719 3.080219,-2.495 2.741303,-7.827676 -0.429687,-10.1015621 C 17.258612,8.3480422 16.25037,8.1334974 15.294922,7.8457031 v 5e-7 -4.4570317 z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        strokeDasharray="1.5, 3"
        strokeDashoffset="11.85"
        d="m 13.912109,7.7441406 c -2.908277,0.014214 -5.5284355,2.4306964 -6.0878903,5.2382814 -0.011911,0.607645 -0.3629704,2.052257 0.4355469,2.117187 H 15.294922 V 7.8457031 C 14.928386,7.8138033 14.561849,7.7819008 14.195313,7.75 14.100963,7.74538 14.005925,7.74368 13.912109,7.7441406 Z"
      />
    </svg>
  ),
  [BooleanOperation.CUT]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      id="svg1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        fill="#DA4167"
        d="M 3.5839844,3.3886719 V 15.099609 h 4.1992187 a 6.4738318,6.4738318 0 0 1 -0.0625,-0.875 A 6.4738318,6.4738318 0 0 1 14.195313,7.75 6.4738318,6.4738318 0 0 1 15.294922,7.8457031 V 3.3886719 Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        d="M 14.195313,7.75 A 6.4738318,6.4738318 0 0 0 7.7207031,14.224609 6.4738318,6.4738318 0 0 0 14.195313,20.697266 6.4738318,6.4738318 0 0 0 20.667969,14.224609 6.4738318,6.4738318 0 0 0 14.195313,7.75 Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        strokeDasharray="1.5, 3"
        strokeDashoffset="11.85"
        d="m 13.912109,7.7441406 c -2.908277,0.014214 -5.5284355,2.4306964 -6.0878903,5.2382814 -0.011911,0.607645 -0.3629704,2.052257 0.4355469,2.117187 H 15.294922 V 7.8457031 C 14.928386,7.8138033 14.561849,7.7819008 14.195313,7.75 14.100963,7.74538 14.005925,7.74368 13.912109,7.7441406 Z"
      />
    </svg>
  ),
  [BooleanOperation.INTERSECTION]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      id="svg1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        d="M 3.5839844,3.3886719 V 15.099609 h 4.1992187 c 0.2188109,2.831376 2.7310469,5.062018 5.4511719,5.496094 1.870142,0.360584 3.865526,-0.211482 5.255859,-1.511719 3.080219,-2.495 2.741303,-7.827676 -0.429687,-10.1015621 C 17.258612,8.3480422 16.25037,8.1334974 15.294922,7.8457031 v 5e-7 -4.4570317 z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#2c7d94"
        strokeMiterlimit="4.5"
        strokeDasharray="1.5, 3"
        strokeDashoffset="11.85"
        fill="#DA4167"
        d="m 13.912109,7.7441406 c -2.908277,0.014214 -5.5284355,2.4306964 -6.0878903,5.2382814 -0.011911,0.607645 -0.3629704,2.052257 0.4355469,2.117187 H 15.294922 V 7.8457031 C 14.928386,7.8138033 14.561849,7.7819008 14.195313,7.75 14.100963,7.74538 14.005925,7.74368 13.912109,7.7441406 Z"
      />
    </svg>
  ),
};

const getIconFor = (operation: BooleanOperation) => {
  return ICONS[operation];
};

export default getIconFor;
