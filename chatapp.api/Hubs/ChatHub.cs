using chatapp.api.Data;
using chatapp.api.DTOs;
using chatapp.api.Extenions;
using chatapp.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace chatapp.api.Hubs
{
    [Authorize]
    public class ChatHub(UserManager<AppUser> userManager,AppDbContext context ) : Hub
    {

        public static readonly ConcurrentDictionary<string, OnlineUserDto>  onlineUsers = new();

        public override async Task OnConnectedAsync()
        {
        var httpContext =  Context.GetHttpContext();
            var recevierId = httpContext?.Request.Query["senderId"].ToString();
            var userName = Context.User!.Identity!.Name!;
            var currentUser = await userManager.FindByNameAsync( userName );
            var connectionId = Context.ConnectionId;

            if (onlineUsers.ContainsKey(userName))
            {
                onlineUsers[userName].ConnectionId = connectionId;
            }
            else
            {
                var user = new OnlineUserDto
                {
                    ConnectionId = connectionId,
                    UserName = userName,
                    ProfileImage = currentUser!.ProfileImage,
                    FullName = currentUser!.FullName,

                };
                onlineUsers.TryAdd(userName, user);

                await Clients.AllExcept(connectionId).SendAsync("Notify", currentUser);
            }
            if (!string.IsNullOrEmpty(recevierId))
            {
                await LoadMessages(recevierId);
            }

            await Clients.All.SendAsync("OnlineUsers", await GetAllUsers());
            
        }


        public async Task LoadMessages(string recipientID, int pageNumber = 1)
        {
            int pageSize = 10;
            var username = Context.User!.Identity!.Name!;
            var currentUser = await userManager.FindByNameAsync(username);

            if (currentUser is null) {
                 return;   
            }

            List<MessageResponseDto> messages = await context.Messages.Where(x => x.ReceiverId == currentUser!.Id &&
            x.SenderId == recipientID || x.SenderId == currentUser!.Id && x.ReceiverId == recipientID)
                .OrderByDescending(x => x.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .OrderBy(x => x.CreatedDate)
                .Select(x => new MessageResponseDto
                {
                    id = x.Id,
                    Content =x.Content,
                    CreatedDate = x.CreatedDate,    
                    ReceiverId = x.ReceiverId,
                    SenderId = x.SenderId,  
                })
                .ToListAsync();

            foreach (var message in messages)
            {
                var msg = await context.Messages.FirstOrDefaultAsync(x => x.Id == message.id);

                if(msg != null && msg.ReceiverId == currentUser.Id)
                {
                    msg.IsRead = true;
                    await context.SaveChangesAsync();
                }
            }

            await Clients.User(currentUser.Id).SendAsync("ReceieveMessageList",messages);

        }
        public async Task SendMessage(MessageRequestDto message)
        {
            var senderId = Context.User!.Identity!.Name;

            var recipientId = message.ReceiverId;

            var newMsg = new Message
            {
                Sender = await userManager.FindByNameAsync(senderId!),
                Receiver = await userManager.FindByIdAsync(recipientId!),
                IsRead = false,
                CreatedDate = DateTime.UtcNow,
                Content = message.Content,
            };

            context.Messages.Add(newMsg);
            await context.SaveChangesAsync();

            await Clients.User(recipientId).SendAsync("ReceiveNewMessage" , newMsg);
        }

        public async Task NotifyTyping(string recipientUserName)
        {
            var senderUserName = Context.User!.Identity!.Name;
            if (senderUserName == null) {
                return;
            }

            var connectionId = onlineUsers.Values.FirstOrDefault(x => x.UserName == recipientUserName)?.ConnectionId;

            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("NotifyTypingToUser", senderUserName);
            }

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User!.Identity!.Name;    
            onlineUsers.TryRemove(username!, out _);
            await Clients.All.SendAsync("OnlineUsers", await GetAllUsers());
        }

        private async Task<IEnumerable<OnlineUserDto>> GetAllUsers()
        {
             var username = Context.User!.GetUserName();

            var onlineUsersSet = new HashSet<string>(onlineUsers.Keys);

            var users = await userManager.Users.Select(u => new OnlineUserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                ProfileImage = u.ProfileImage,
                IsOnline = onlineUsersSet.Contains(u.UserName),
                UnreadCount = context.Messages.Count(x => x.ReceiverId == username && x.SenderId == u.Id && !x.IsRead)
            }).OrderByDescending(u => u.IsOnline)
            .ToListAsync();

            return users;
        }
    }
}
