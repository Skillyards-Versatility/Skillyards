import { Resend } from 'resend';

let _resend = null;

export function getResend() {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — emails will be skipped");
      return null;
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}