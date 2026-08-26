"use server";

import { db } from "@/db";
import {
  prayerRequests,
  testimonies,
  visitorRequests,
  contactMessages,
  ksmApplications,
  vocationalApplications,
} from "@/db/schema";
import type { FormResult } from "@/components/FormShell";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

function reference(prefix: string) {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${rand}`;
}

export async function submitPrayerRequest(_p: FormResult, fd: FormData): Promise<FormResult> {
  const request = str(fd, "request");
  if (!request) return { ok: false, message: "Please write your prayer request." };
  try {
    await db.insert(prayerRequests).values({
      name: str(fd, "name") || "Anonymous",
      contact: str(fd, "contact"),
      request,
      confidential: bool(fd, "confidential"),
    });
    return { ok: true, message: "Your prayer request has been received. We are praying with you." };
  } catch {
    return { ok: false, message: "We could not send your request just now. Please try again shortly." };
  }
}

export async function submitTestimony(_p: FormResult, fd: FormData): Promise<FormResult> {
  const name = str(fd, "name");
  const body = str(fd, "body");
  if (!name || !body) return { ok: false, message: "Please provide your name and testimony." };
  try {
    await db.insert(testimonies).values({
      name,
      body,
      photoUrl: str(fd, "photoUrl") || null,
      videoUrl: str(fd, "videoUrl") || null,
      permission: bool(fd, "permission"),
      status: "pending",
    });
    return {
      ok: true,
      message: "Thank you! Your testimony has been submitted for review before publication.",
    };
  } catch {
    return { ok: false, message: "We could not submit your testimony. Please try again shortly." };
  }
}

export async function submitVisitorRequest(_p: FormResult, fd: FormData): Promise<FormResult> {
  const name = str(fd, "name");
  if (!name) return { ok: false, message: "Please tell us your name." };
  try {
    await db.insert(visitorRequests).values({
      name,
      phone: str(fd, "phone"),
      email: str(fd, "email"),
      attendingCount: Number(str(fd, "attendingCount") || "1") || 1,
      bringingChildren: bool(fd, "bringingChildren"),
      preferredService: str(fd, "preferredService"),
      message: str(fd, "message"),
    });
    return { ok: true, message: "Wonderful! We will be expecting you and your family." };
  } catch {
    return { ok: false, message: "We could not save your visit plan. Please try again shortly." };
  }
}

export async function submitContactMessage(_p: FormResult, fd: FormData): Promise<FormResult> {
  const name = str(fd, "name");
  const message = str(fd, "message");
  if (!name || !message) return { ok: false, message: "Please provide your name and message." };
  try {
    await db.insert(contactMessages).values({
      name,
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      subject: str(fd, "subject"),
      message,
    });
    return { ok: true, message: "Thank you for reaching out. We have received your message." };
  } catch {
    return { ok: false, message: "We could not send your message. Please try again shortly." };
  }
}

export async function submitKsmApplication(_p: FormResult, fd: FormData): Promise<FormResult> {
  const fullName = str(fd, "fullName");
  const email = str(fd, "email");
  if (!fullName || !email) return { ok: false, message: "Full name and email address are required." };
  if (!bool(fd, "agreement"))
    return { ok: false, message: "Please confirm the declaration before submitting your application." };
  const ref = reference("KSM");
  try {
    await db.insert(ksmApplications).values({
      reference: ref,
      fullName,
      gender: str(fd, "gender"),
      dateOfBirth: str(fd, "dateOfBirth"),
      phone: str(fd, "phone"),
      whatsapp: str(fd, "whatsapp"),
      email,
      address: str(fd, "address"),
      state: str(fd, "state"),
      country: str(fd, "country"),
      church: str(fd, "church"),
      denomination: str(fd, "denomination"),
      churchRole: str(fd, "churchRole"),
      ministryExperience: str(fd, "ministryExperience"),
      motivation: str(fd, "motivation"),
      programme: str(fd, "programme"),
      photoUrl: str(fd, "photoUrl") || null,
    });
    return {
      ok: true,
      message: "Your KSM application has been received successfully.",
      reference: ref,
    };
  } catch {
    return { ok: false, message: "We could not submit your application. Please try again shortly." };
  }
}

export async function submitVocationalApplication(_p: FormResult, fd: FormData): Promise<FormResult> {
  const fullName = str(fd, "fullName");
  const phone = str(fd, "phone");
  if (!fullName || !phone) return { ok: false, message: "Please provide your name and phone number." };
  const ref = reference("VOC");
  try {
    await db.insert(vocationalApplications).values({
      reference: ref,
      fullName,
      phone,
      whatsapp: str(fd, "whatsapp"),
      email: str(fd, "email"),
      gender: str(fd, "gender"),
      ageRange: str(fd, "ageRange"),
      address: str(fd, "address"),
      courseTitle: str(fd, "courseTitle"),
      experience: str(fd, "experience"),
      employmentStatus: str(fd, "employmentStatus"),
      reason: str(fd, "reason"),
    });
    return { ok: true, message: "Your training registration has been received.", reference: ref };
  } catch {
    return { ok: false, message: "We could not submit your registration. Please try again shortly." };
  }
}
