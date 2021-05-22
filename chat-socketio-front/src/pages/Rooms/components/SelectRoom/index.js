export default function SelectRoom(props) {
    return (
        <div className="room">
            <div className="messages">
                <div className="message"><span className="msg-body">Selecione uma Sala</span></div>
            </div>
            <div className="new-message-form w-form">
                <form className="form">
                    <textarea id="field" name="field" maxLength="5000" placeholder="Digite sua mensagem e pressione &lt;Enter&gt;" autoFocus={true} className="msg w-input"></textarea>
                    <button type="button" className="send-audio w-button">Enviar<br />Áudio</button>
                </form>
            </div>
        </div>
    )
}