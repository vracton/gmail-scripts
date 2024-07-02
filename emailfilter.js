function process() {
  const TBP = GmailApp.getUserLabelByName("TBP");
  const threads = TBP.getThreads();
  for (let a = 0; a < threads.length; a++) {
    //Get messages in thread
    const messages = threads[a].getMessages();
    //Get last message
    const message = messages[messages.length - 1];
    try {
      if (message.getFrom().split("@")[1].split(">")[0] === "") {
        const body = message.getPlainBody().toLowerCase();
        GmailApp.getUserLabelByName("classmate").addToThread(threads[a]);
        //Check if we need the bot to reply
        
      } else if (message.getFrom().split("@")[1].split(">")[0] === "school.edu") {
        GmailApp.getUserLabelByName("teacher").addToThread(threads[a]);
      } else {
        let isTrash = false
        if (message.getFrom().split("<").length > 1) {
          if (message.getFrom().split("<")[1].split(">")[0] ==="no-reply@classroom.google.com") {
            isTrash = true
          }
        }
        if (!isTrash){
          GmailApp.getUserLabelByName("other").addToThread(threads[a]);
        }
      }
      //Remove from TBP
      threads[a].removeLabel(TBP);
    } catch (e) {}
  }
}
