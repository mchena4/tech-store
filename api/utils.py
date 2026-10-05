from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings

def send_order_confirmation_mail(order):
    # Who receives the email
    subject = f"Confirmación de tu pedido {order.order_code}"

    # Build the HTML content for the email
    items_html = ""
    for item in order.items.all():
        items_html += f"<li>{item.quantity} x <strong>{item.product.name}<strong> - ${item.price} </li>"

    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2e6c80;">¡Gracias por tu compra, {order.user.username}! 🎉</h2>
        <p>Tu pago ha sido procesado exitosamente a través de Mercado Pago. Aquí tienes los detalles de tu pedido:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Código de Orden:</strong> {order.order_code}</p>
            <ul>
                {items_html}
            </ul>
            <h3 style="color: #2e6c80;">Total pagado: ${order.total_amount}</h3>
        </div>
        
        <p>Te enviaremos otro correo cuando tu pedido sea enviado.</p>
    </div>
    """

    # Convert HTML content to plain text for email clients that do not support HTML
    text_content = strip_tags(html_content)

    # Create the email message
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.EMAIL_HOST_USER,
        to=order.user.email
    )

    # Attach the HTML content to the email
    email.attach_alternative(html_content, "text/html")

    # Send the email
    try:
        email.send()
        return f"Email sent successfully to {order.user.email}"
    except Exception as e:
        return f"Error sending email to {order.user.email}: {str(e)}"