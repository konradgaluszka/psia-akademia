import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Email:
    to_email: str
    subject: str
    body: str
    from_email: str

    def to_message(self) -> EmailMessage:
        msg = EmailMessage()
        msg["Subject"] = self.subject
        msg["From"] = self.from_email
        msg["To"] = self.to_email
        msg.set_content(self.body)
        return msg


def build_verification_email(to_email: str, verification_link: str) -> Email:
    settings = get_settings()
    body = (
        "Hi,\n\n"
        "Thanks for signing up. Please verify your email by clicking the link below:\n"
        f"{verification_link}\n\n"
        "If you did not request this, you can ignore this email.\n"
    )
    return Email(
        to_email=to_email,
        subject="Verify your email",
        body=body,
        from_email=settings.email_from,
    )


def send_email(email: Email) -> None:
    settings = get_settings()

    if not settings.smtp_host:
        logger.info("Email (console fallback):\n%s", email)
        return

    host = settings.smtp_host
    port = settings.smtp_port
    user = settings.smtp_user
    password = settings.smtp_password

    logger.info(
        "Attempting SMTP send",
        extra={
            "email_to": email.to_email,
            "email_from": email.from_email,
            "smtp_host": host,
            "smtp_port": port,
            "smtp_user_set": bool(user),
        },
    )

    try:
        message = email.to_message()
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.starttls()
            if user and password:
                smtp.login(user, password)
            smtp.send_message(message)
            logger.info("Sent email to %s via %s:%s", email.to_email, host, port)
    except Exception:
        logger.exception("Failed to send email to %s via %s:%s", email.to_email, host, port)
        raise


def send_verification_email(to_email: str, token: str) -> None:
    settings = get_settings()
    verification_link = f"{settings.verification_base_url}?token={token}"
    logger.info("Queueing verification email", extra={"email_to": to_email, "link": verification_link})
    email = build_verification_email(to_email, verification_link)
    send_email(email)
