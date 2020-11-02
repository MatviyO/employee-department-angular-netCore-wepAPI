using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    public class EmployeeController : ApiController
    {
        public HttpResponseMessage Get()
        {
            string query = @"
                        select EmployeeId,EmployeeName,Department,
                        convert(varchar(10),DateOfJoining, 120) as DateOfJoining,
                         PhotoFileName   
                            from 
                             dbo.Employee";
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager
                .ConnectionStrings["EmployeeDB"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                da.Fill(table);
            }

            return Request.CreateResponse(HttpStatusCode.OK, table);
        }
        public string Post(Employee emp)
        {
            try
            {
                string query = @"
                                  insert into dbo.Employee values
                                  (
                                        '" + emp.EmployeeName + @"'
                                        ,'" + emp.Department + @"'
                                           ,'" + emp.DateOfJoining + @"'
                                            ,'" + emp.PhotoFileName + @"'
                                    )";
                DataTable table = new DataTable();
                using (var con = new SqlConnection(ConfigurationManager
                    .ConnectionStrings["EmployeeDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                using (var da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.Text;
                    da.Fill(table);
                }
                return "Added Successfully";

            }
            catch (Exception)
            {
                return "Failed to add";
            }

        }
        public string Put(Employee emp)
        {
            try
            {
                string query = @"
                                  update dbo.Employee set 
                                        EmployeeName='" + emp.EmployeeName + @"'
                                          ,Department = '" + emp.Department + @"'
                                            ,DateOfJoining = '" + emp.DateOfJoining + @"'
                                            , PhotoFileName = '" + emp.PhotoFileName + @"'
                                    where EmployeeId=" + emp.EmployeeId + @"";
                DataTable table = new DataTable();
                using (var con = new SqlConnection(ConfigurationManager
                    .ConnectionStrings["EmployeeDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                using (var da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.Text;
                    da.Fill(table);
                }
                return "Updated Successfully";

            }
            catch (Exception)
            {
                return "Failed to Updated ";
            }

        }
        public string Delete(int id)
        {
            try
            {
                string query = @"
                                  delete from dbo.Employee
                                    where EmployeeId=" + id + @"";
                DataTable table = new DataTable();
                using (var con = new SqlConnection(ConfigurationManager
                    .ConnectionStrings["EmployeeDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                using (var da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.Text;
                    da.Fill(table);
                }
                return "Deleted Successfully";

            }
            catch (Exception)
            {
                return "Failed to deleted";
            }

        }
        [Route("api/Employee/GetAllDepartmentNames")]
        [HttpGet]
        public HttpResponseMessage GetAllDepartmentNames()
        {
            string query = @"
                                  select DepartmentName from dbo.Department";
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager
                .ConnectionStrings["EmployeeDB"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                da.Fill(table);
            }
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }
        [Route("api/Employee/SaveFile")]
        public string SaveFile()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                var pytsicalPath = HttpContext.Current.Server.MapPath("~/Photos/" + fileName);
                postedFile.SaveAs(pytsicalPath);
                return fileName;
            }
            catch(Exception)
            {
                return "anonymous.png";
            }
        }
    }
}
