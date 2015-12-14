namespace Stroop.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TestResult
    {
        [Key]
        public Guid ReportId { get; set; }

        [Column(TypeName = "timestamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [MaxLength(8)]
        public byte[] Date { get; set; }

        [Column(TypeName = "text")]
        public string UserName { get; set; }

        [Column(TypeName = "text")]
        public string RoundType { get; set; }

        public int? RightCount { get; set; }

        public int? WrongCount { get; set; }

        public int? TotalScore { get; set; }
    }
}
