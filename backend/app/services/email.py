import logging
import smtplib
from email.message import EmailMessage
from typing import Any

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def build_verification_email(to_email: str, verification_link: str) -> EmailMessage:
    settings = get_settings()
    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = settings.email_from
    msg["To"] = to_email
    body = (
        "Hi,\n\n"
        "Thanks for signing up. Please verify your email by clicking the link below:\n"
        f"{verification_link}\n\n"
        "If you did not request this, you can ignore this email.\n"
    )
    msg.set_content(body)
    return msg


def send_email(message: EmailMessage) -> None:
    settings = get_settings()

    if not settings.smtp_host:
        logger.info("Email (console fallback):\n%s", message)
        return

    host = settings.smtp_host
    port = settings.smtp_port
    user = settings.smtp_user
    password = settings.smtp_password

    logger.info(
        "Attempting SMTP send",
        extra={
            "email_to": message["To"],
            "email_from": message["From"],
            "smtp_host": host,
            "smtp_port": port,
            "smtp_user_set": bool(user),
        },
    )

    try:
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.starttls()
            if user and password:
                smtp.login(user, password)
            smtp.send_message(message)
            logger.info("Sent email to %s via %s:%s", message["To"], host, port)
    except Exception:
        logger.exception("Failed to send email to %s via %s:%s", message["To"], host, port)
        raise


def send_verification_email(to_email: str, token: str) -> None:
    settings = get_settings()
    verification_link = f"{settings.verification_base_url}?token={token}"
    logger.info("Queueing verification email", extra={"email_to": to_email, "link": verification_link})
    message = build_verification_email(to_email, verification_link)
    send_email(message)
