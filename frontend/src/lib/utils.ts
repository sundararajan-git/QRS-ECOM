import type { ErrorToastType } from "@/types";
import { clsx, type ClassValue } from "clsx"
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const showErrorToast = (err: ErrorToastType) => {
  console.error(err);
  if (typeof err === "object" && err !== null && "response" in err) {
    const errorWithResponse = err as {
      response?: { data?: { message?: string } };
    };
    if (errorWithResponse.response?.data?.message) {
      toast.error(err?.response?.data?.message || "Something went wrong !");
    } else {
      toast.error("An unexpected error occurred.");
    }
  } else if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error(String(err));
  }
};

export const validateForm = (form: HTMLFormElement): boolean => {
  try {
    let isValid = true;

    Array.from(form.elements).forEach((element: Element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        const htmlElement = element as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;

        if (htmlElement?.required && !htmlElement.value) {
          isValid = false;
          if (htmlElement.type === "file") {
            const fileInput = document.getElementById(
              `${htmlElement.id}`
            ) as HTMLElement;
            fileInput.classList.add("border-red-600");
          } else {
            htmlElement.classList.add("border-red-600");
          }
        } else {
          if (htmlElement.type === "file") {
            const fileInput = document.getElementById(
              `${htmlElement.id}`
            ) as HTMLElement;
            fileInput.classList.remove("border-red-600");
          } else {
            htmlElement.classList.remove("border-red-600");
          }
        }
      }
    });

    return isValid;
  } catch {
    return false;
  }
};

export const getJWT = () => {
  const jwtString = localStorage.getItem("jwt");
  return jwtString ? JSON.parse(jwtString) : null;
};

export const setJWT = (token: string) => {
  localStorage.setItem("jwt", JSON.stringify(token));
};

export const clearJWT = () => {
  localStorage.setItem("jwt", JSON.stringify(null));
};

export const titleCase = (str: string | null) =>
  str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
