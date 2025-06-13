﻿namespace chatapp.api.DTOs
{
    public class MessageRequestDto
    {
        public int id {  get; set; }

        public string? SenderId { get; set; }   

        public string? ReceiverId { get; set; } 

        public string? Content { get; set; }    

        public bool IsRead { get; set; }    

        public DateTime? CreatedDate { get; set; }
    }
}
