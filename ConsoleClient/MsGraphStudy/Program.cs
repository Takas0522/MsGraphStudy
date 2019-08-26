using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace MsGraphStudy
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("using Secret(y/n)?");
            var usingSecret = (Console.ReadLine() == "y");

            Console.WriteLine("Enter ClientId");
            var clientId = Console.ReadLine();

            Console.WriteLine("Enter TenantId");
            var tenantId = Console.ReadLine();

            var secret = "";
            if (usingSecret)
            {
                Console.WriteLine("Enter Secret");
                secret = Console.ReadLine();
            }

            Console.WriteLine("Enter Scopes(exit='fin')");
            var isfin = false;
            var scopes = new List<string>();
            do
            {
                var scope = Console.ReadLine();
                isfin = (scope == "fin");
                if (!isfin)
                {
                    scopes.Add(scope);
                }
            } while (!isfin);

            Console.WriteLine("GetToken!!---------------------------------------------");
            if (usingSecret)
            {
                GraphClientProvider.MakeConfidtentionalClient(clientId, tenantId, secret);
                var res = GraphClientProvider.GetTokenForConfidentialClientAsync(scopes).Result;
                Console.WriteLine(res);
            }
            else
            {
                GraphClientProvider.MakePublicClient(clientId, tenantId);
                var res = GraphClientProvider.GetTokenForPublicClientAsync(scopes).Result;
                Console.WriteLine(res);
            }

            Console.WriteLine("AccessGraph--------------------------------------------");
            var client = GraphClientProvider.GetGraphServiceClient(scopes);

            Console.WriteLine("----User(Me)-----------------------------------------------");
            try
            {
                var data = client.Me.Request().GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("----User(PrincipalName)-----------------------------------------------");
            try
            {
                var name = Console.ReadLine();
                var data = client.Users[name].Request().GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("----CalenderView(Me)-----------------------------------------------");
            try
            {
                var options = new List<Option>() {
                    new QueryOption("startDateTime", new DateTime(2019, 1, 1).ToString("yyyy-MM-ddThh:mm:ss")),
                    new QueryOption("endDateTime", new DateTime(2019, 12, 31).ToString("yyyy-MM-ddThh:mm:ss"))
                };
                var data = client.Me.CalendarView.Request(options).GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("----CalenderView(User)-----------------------------------------------");
            try
            {
                var options = new List<Option>() {
                    new QueryOption("startDateTime", new DateTime(2019, 1, 1).ToString("yyyy-MM-ddThh:mm:ss")),
                    new QueryOption("endDateTime", new DateTime(2019, 12, 31).ToString("yyyy-MM-ddThh:mm:ss"))
                };
                var name = Console.ReadLine();
                var data = client.Users[name].CalendarView.Request(options).GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("----Mail(Me)-----------------------------------------------");
            try
            {
                var data = client.Me.MailFolders.Request().GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("----Mail(User)-----------------------------------------------");
            try
            {
                var name = Console.ReadLine();
                var data = client.Users[name].MailFolders.Request().GetAsync().Result;
                var json = JsonConvert.SerializeObject(data);
                Console.WriteLine(json);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception------------------------------------------");
                Console.WriteLine(e.Message);
            }

            Console.ReadLine();

        }
    }
}
