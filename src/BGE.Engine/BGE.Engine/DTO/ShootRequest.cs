using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BGE.Engine.Game;
using FluentValidation;
using FluentValidation.Results;

namespace BGE.Engine.DTO
{
	public class ShootRequest
	{
		public int X { get; set; }
		public int Y { get; set; }
		public char[,] Field { get; set; }
	}

    public static class ShootRequestExtensions
    {
        public static async Task ValidateAndThrowAsync(this ShootRequest shootRequest, PlayerState playerState)
        {
            var context = new ValidationContext<ShootRequest>(shootRequest);
            context.RootContextData.Add(new KeyValuePair<string, object>("playerState", playerState));
            var validator = new ShootRequestValidator();
            var result = await validator.ValidateAsync(context);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);
        }
    }

	public class ShootRequestValidator : AbstractValidator<ShootRequest>
	{
		public override async Task<ValidationResult> ValidateAsync(ValidationContext<ShootRequest> context, CancellationToken cancellation = new CancellationToken())
		{
			var result = await base.ValidateAsync(context, cancellation);
			if (!(context.RootContextData["playerState"] is PlayerState playerState))
			{
				result.Errors.Add(new ValidationFailure("PlayerState", "No player state is supplied"));
				return result;
			}

			var shootRequest = context.InstanceToValidate;
			if (!IsValid(shootRequest.X, playerState, 0))
				result.Errors.Add(new ValidationFailure("X", "X value is out of bounds", shootRequest.X));
			
			if (!IsValid(shootRequest.Y, playerState, 1))
				result.Errors.Add(new ValidationFailure("Y", "Y value is out of bounds", shootRequest.Y));
			
			if(playerState.Field[shootRequest.X - 1, shootRequest.Y - 1] == Constants.FieldHitSymbol)
				result.Errors.Add(new ValidationFailure("XY","The cell is already shot"));

			return result;
		}
		
		private static bool IsValid(int value, PlayerState playerState, int dimension)
		{
			var field = playerState.Field;
			var max = field.GetUpperBound(dimension) + 1;
			return 1 <= value && value <= max;
		}
	}


}