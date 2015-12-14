namespace Stroop.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Report : DbContext
    {
        public Report()
            : base("name=Report")
        {
        }

        public virtual DbSet<TestResult> TestResults { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TestResult>()
                .Property(e => e.Date)
                .IsFixedLength();

            modelBuilder.Entity<TestResult>()
                .Property(e => e.UserName)
                .IsUnicode(false);

            modelBuilder.Entity<TestResult>()
                .Property(e => e.RoundType)
                .IsUnicode(false);
        }
    }
}
