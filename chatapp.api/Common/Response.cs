namespace chatapp.api.Common
{
    public class Response<T>
    {
        public bool IsSuccess { get; set; }

        public T Data { get; }

        public string? Error { get; set; }

        public string? Message { get; set; }

        public Response(bool isSuccess , T data,  string? error , string? message )
        {
            Data = data;
            IsSuccess = isSuccess;
            Error = error;
            Message = message;
        }

        public static Response<T> Success(T data, string? message = "") =>  new (true, data, null, message);
        

        public static Response<T> Failure(string error) => new(false, default!, error, null);
       
    }
}
